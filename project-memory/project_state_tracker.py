#!/usr/bin/env python3
"""
AI News Scraper - Project State Tracker
Automatically tracks and updates project memory framework with current state
"""

import os
import sys
import json
import logging
import subprocess
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import re

class ProjectStateTracker:
    def __init__(self):
        """Initialize the project state tracker."""
        self.project_root = os.path.dirname(os.path.abspath(__file__))
        self.framework_file = os.path.join(self.project_root, 'PROJECT_MEMORY_FRAMEWORK.md')
        self.state_file = os.path.join(self.project_root, 'project_state.json')
        
        # Configure logging
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s'
        )
        self.logger = logging.getLogger(__name__)

    def analyze_project_structure(self) -> Dict:
        """Analyze current project structure and files."""
        structure = {
            'core_files': [],
            'documentation_files': [],
            'automation_files': [],
            'output_directories': [],
            'total_files': 0,
            'total_size_mb': 0
        }
        
        try:
            for root, dirs, files in os.walk(self.project_root):
                # Skip hidden directories and __pycache__
                dirs[:] = [d for d in dirs if not d.startswith('.') and d != '__pycache__']
                
                for file in files:
                    if file.startswith('.') or file.endswith('.pyc'):
                        continue
                    
                    file_path = os.path.join(root, file)
                    relative_path = os.path.relpath(file_path, self.project_root)
                    file_size = os.path.getsize(file_path)
                    
                    structure['total_files'] += 1
                    structure['total_size_mb'] += file_size / (1024 * 1024)
                    
                    # Categorize files
                    if file.endswith('.py'):
                        structure['core_files'].append({
                            'path': relative_path,
                            'size_kb': file_size / 1024,
                            'lines': self._count_lines(file_path)
                        })
                    elif file.endswith('.md'):
                        structure['documentation_files'].append({
                            'path': relative_path,
                            'size_kb': file_size / 1024
                        })
                    elif file.endswith('.sh'):
                        structure['automation_files'].append({
                            'path': relative_path,
                            'size_kb': file_size / 1024,
                            'executable': os.access(file_path, os.X_OK)
                        })
                
                # Track directories
                if root != self.project_root:
                    dir_name = os.path.basename(root)
                    if dir_name in ['reports', 'logs']:
                        file_count = len([f for f in files if not f.startswith('.')])
                        structure['output_directories'].append({
                            'name': dir_name,
                            'path': os.path.relpath(root, self.project_root),
                            'file_count': file_count
                        })
        
        except Exception as e:
            self.logger.error(f"Error analyzing project structure: {e}")
        
        return structure

    def _count_lines(self, file_path: str) -> int:
        """Count lines in a file."""
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                return sum(1 for _ in f)
        except:
            return 0

    def check_dependencies(self) -> Dict:
        """Check status of project dependencies."""
        deps_status = {
            'requirements_file_exists': False,
            'dependencies': [],
            'python_version': sys.version,
            'pip_packages': []
        }
        
        # Check requirements.txt
        req_file = os.path.join(self.project_root, 'requirements.txt')
        if os.path.exists(req_file):
            deps_status['requirements_file_exists'] = True
            try:
                with open(req_file, 'r') as f:
                    deps_status['dependencies'] = [line.strip() for line in f if line.strip()]
            except Exception as e:
                self.logger.error(f"Error reading requirements.txt: {e}")
        
        # Check installed packages
        try:
            result = subprocess.run(['pip', 'list', '--format=json'], 
                                  capture_output=True, text=True, timeout=30)
            if result.returncode == 0:
                packages = json.loads(result.stdout)
                deps_status['pip_packages'] = packages
        except Exception as e:
            self.logger.warning(f"Could not get pip package list: {e}")
        
        return deps_status

    def analyze_recent_activity(self) -> Dict:
        """Analyze recent project activity."""
        activity = {
            'recent_files_modified': [],
            'recent_reports_generated': [],
            'log_file_status': {},
            'last_execution_times': {}
        }
        
        try:
            # Check for recently modified files (last 7 days)
            week_ago = datetime.now() - timedelta(days=7)
            
            for root, dirs, files in os.walk(self.project_root):
                dirs[:] = [d for d in dirs if not d.startswith('.')]
                
                for file in files:
                    if file.startswith('.'):
                        continue
                    
                    file_path = os.path.join(root, file)
                    try:
                        mod_time = datetime.fromtimestamp(os.path.getmtime(file_path))
                        if mod_time > week_ago:
                            activity['recent_files_modified'].append({
                                'path': os.path.relpath(file_path, self.project_root),
                                'modified': mod_time.isoformat(),
                                'size_kb': os.path.getsize(file_path) / 1024
                            })
                    except:
                        continue
            
            # Check reports directory
            reports_dir = os.path.join(self.project_root, 'reports')
            if os.path.exists(reports_dir):
                for file in os.listdir(reports_dir):
                    if file.startswith('ai_news_'):
                        file_path = os.path.join(reports_dir, file)
                        try:
                            mod_time = datetime.fromtimestamp(os.path.getmtime(file_path))
                            if mod_time > week_ago:
                                activity['recent_reports_generated'].append({
                                    'filename': file,
                                    'generated': mod_time.isoformat(),
                                    'size_kb': os.path.getsize(file_path) / 1024
                                })
                        except:
                            continue
            
            # Check log files
            log_files = ['ai_news_scraper.log', 'logs/ai_news_scraper.log']
            for log_file in log_files:
                log_path = os.path.join(self.project_root, log_file)
                if os.path.exists(log_path):
                    try:
                        stat = os.stat(log_path)
                        activity['log_file_status'][log_file] = {
                            'exists': True,
                            'size_kb': stat.st_size / 1024,
                            'modified': datetime.fromtimestamp(stat.st_mtime).isoformat()
                        }
                    except:
                        activity['log_file_status'][log_file] = {'exists': False}
        
        except Exception as e:
            self.logger.error(f"Error analyzing recent activity: {e}")
        
        return activity

    def check_automation_status(self) -> Dict:
        """Check status of automation setup."""
        automation = {
            'shell_scripts': [],
            'cron_jobs': [],
            'executable_permissions': {}
        }
        
        # Check shell scripts
        shell_scripts = ['run_daily.sh', 'run_weekly.sh', 'setup_weekly_automation.sh']
        for script in shell_scripts:
            script_path = os.path.join(self.project_root, script)
            if os.path.exists(script_path):
                automation['shell_scripts'].append({
                    'name': script,
                    'exists': True,
                    'executable': os.access(script_path, os.X_OK),
                    'size_kb': os.path.getsize(script_path) / 1024
                })
                automation['executable_permissions'][script] = os.access(script_path, os.X_OK)
            else:
                automation['shell_scripts'].append({
                    'name': script,
                    'exists': False
                })
        
        # Check for cron jobs (if possible)
        try:
            result = subprocess.run(['crontab', '-l'], 
                                  capture_output=True, text=True, timeout=10)
            if result.returncode == 0:
                cron_lines = result.stdout.strip().split('\n')
                for line in cron_lines:
                    if 'ai-news-scraper' in line or 'run_weekly.sh' in line:
                        automation['cron_jobs'].append(line.strip())
        except Exception as e:
            self.logger.warning(f"Could not check cron jobs: {e}")
        
        return automation

    def generate_performance_metrics(self) -> Dict:
        """Generate performance metrics from recent runs."""
        metrics = {
            'recent_report_sizes': [],
            'estimated_processing_times': [],
            'article_counts': [],
            'success_indicators': []
        }
        
        try:
            # Analyze recent reports
            reports_dir = os.path.join(self.project_root, 'reports')
            if os.path.exists(reports_dir):
                for file in os.listdir(reports_dir):
                    if file.startswith('ai_news_'):
                        file_path = os.path.join(reports_dir, file)
                        try:
                            size_kb = os.path.getsize(file_path) / 1024
                            metrics['recent_report_sizes'].append({
                                'filename': file,
                                'size_kb': size_kb
                            })
                            
                            # Try to extract article count from HTML reports
                            if file.endswith('.html'):
                                with open(file_path, 'r', encoding='utf-8') as f:
                                    content = f.read()
                                    # Look for article count in HTML
                                    count_match = re.search(r'(\d+)\s+Articles', content)
                                    if count_match:
                                        metrics['article_counts'].append({
                                            'filename': file,
                                            'article_count': int(count_match.group(1))
                                        })
                        except:
                            continue
            
            # Check log files for success indicators
            log_files = ['ai_news_scraper.log', 'logs/ai_news_scraper.log']
            for log_file in log_files:
                log_path = os.path.join(self.project_root, log_file)
                if os.path.exists(log_path):
                    try:
                        with open(log_path, 'r', encoding='utf-8', errors='ignore') as f:
                            recent_lines = f.readlines()[-100:]  # Last 100 lines
                            success_count = sum(1 for line in recent_lines if 'successfully' in line.lower())
                            error_count = sum(1 for line in recent_lines if 'error' in line.lower())
                            
                            metrics['success_indicators'].append({
                                'log_file': log_file,
                                'recent_success_mentions': success_count,
                                'recent_error_mentions': error_count
                            })
                    except:
                        continue
        
        except Exception as e:
            self.logger.error(f"Error generating performance metrics: {e}")
        
        return metrics

    def collect_current_state(self) -> Dict:
        """Collect comprehensive current project state."""
        self.logger.info("Collecting current project state...")
        
        state = {
            'timestamp': datetime.now().isoformat(),
            'project_structure': self.analyze_project_structure(),
            'dependencies': self.check_dependencies(),
            'recent_activity': self.analyze_recent_activity(),
            'automation_status': self.check_automation_status(),
            'performance_metrics': self.generate_performance_metrics()
        }
        
        return state

    def save_state(self, state: Dict) -> None:
        """Save current state to JSON file."""
        try:
            with open(self.state_file, 'w', encoding='utf-8') as f:
                json.dump(state, f, indent=2, default=str)
            self.logger.info(f"Project state saved to {self.state_file}")
        except Exception as e:
            self.logger.error(f"Error saving state: {e}")

    def load_previous_state(self) -> Optional[Dict]:
        """Load previous state from JSON file."""
        try:
            if os.path.exists(self.state_file):
                with open(self.state_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
        except Exception as e:
            self.logger.warning(f"Could not load previous state: {e}")
        return None

    def generate_state_summary(self, state: Dict) -> str:
        """Generate a human-readable summary of current state."""
        summary = []
        
        # Project overview
        structure = state.get('project_structure', {})
        summary.append(f"📊 PROJECT OVERVIEW")
        summary.append(f"   Total Files: {structure.get('total_files', 0)}")
        summary.append(f"   Total Size: {structure.get('total_size_mb', 0):.1f} MB")
        summary.append(f"   Core Python Files: {len(structure.get('core_files', []))}")
        summary.append(f"   Documentation Files: {len(structure.get('documentation_files', []))}")
        summary.append("")
        
        # Dependencies
        deps = state.get('dependencies', {})
        summary.append(f"🔧 DEPENDENCIES")
        summary.append(f"   Requirements File: {'✅' if deps.get('requirements_file_exists') else '❌'}")
        summary.append(f"   Listed Dependencies: {len(deps.get('dependencies', []))}")
        summary.append(f"   Installed Packages: {len(deps.get('pip_packages', []))}")
        summary.append("")
        
        # Recent activity
        activity = state.get('recent_activity', {})
        summary.append(f"📈 RECENT ACTIVITY (Last 7 Days)")
        summary.append(f"   Files Modified: {len(activity.get('recent_files_modified', []))}")
        summary.append(f"   Reports Generated: {len(activity.get('recent_reports_generated', []))}")
        summary.append("")
        
        # Automation
        automation = state.get('automation_status', {})
        summary.append(f"⚙️ AUTOMATION STATUS")
        executable_scripts = sum(1 for script in automation.get('shell_scripts', []) 
                               if script.get('executable', False))
        summary.append(f"   Executable Scripts: {executable_scripts}/{len(automation.get('shell_scripts', []))}")
        summary.append(f"   Cron Jobs Found: {len(automation.get('cron_jobs', []))}")
        summary.append("")
        
        # Performance
        metrics = state.get('performance_metrics', {})
        summary.append(f"📊 PERFORMANCE METRICS")
        summary.append(f"   Recent Reports: {len(metrics.get('recent_report_sizes', []))}")
        if metrics.get('article_counts'):
            avg_articles = sum(r['article_count'] for r in metrics['article_counts']) / len(metrics['article_counts'])
            summary.append(f"   Average Articles per Report: {avg_articles:.1f}")
        
        return "\n".join(summary)

    def update_framework_file(self, state: Dict) -> None:
        """Update the PROJECT_MEMORY_FRAMEWORK.md file with current state."""
        if not os.path.exists(self.framework_file):
            self.logger.warning("Framework file not found, skipping update")
            return
        
        try:
            # Read current framework file
            with open(self.framework_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Update timestamp
            current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S AM (America/Toronto)')
            content = re.sub(
                r'\*\*Last Updated\*\*: [^\n]+',
                f'**Last Updated**: {current_time}',
                content
            )
            
            # Update performance metrics section if found
            structure = state.get('project_structure', {})
            if structure:
                # Update file counts in the framework
                total_files = structure.get('total_files', 0)
                total_size = structure.get('total_size_mb', 0)
                
                # This is a basic update - in practice, you might want more sophisticated updates
                self.logger.info(f"Framework file would be updated with: {total_files} files, {total_size:.1f} MB")
            
            # Write updated content back
            with open(self.framework_file, 'w', encoding='utf-8') as f:
                f.write(content)
            
            self.logger.info("Framework file updated successfully")
            
        except Exception as e:
            self.logger.error(f"Error updating framework file: {e}")

    def run_state_tracking(self) -> None:
        """Run complete state tracking process."""
        self.logger.info("Starting project state tracking...")
        
        # Collect current state
        current_state = self.collect_current_state()
        
        # Load previous state for comparison
        previous_state = self.load_previous_state()
        
        # Save current state
        self.save_state(current_state)
        
        # Generate and display summary
        summary = self.generate_state_summary(current_state)
        print("\n" + "="*60)
        print("AI NEWS SCRAPER - PROJECT STATE SUMMARY")
        print("="*60)
        print(summary)
        print("="*60)
        
        # Update framework file
        self.update_framework_file(current_state)
        
        self.logger.info("Project state tracking completed")

def main():
    """Main function to run project state tracking."""
    try:
        tracker = ProjectStateTracker()
        tracker.run_state_tracking()
        
    except Exception as e:
        print(f"❌ Error running project state tracker: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
