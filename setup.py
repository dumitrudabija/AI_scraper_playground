#!/usr/bin/env python3
"""
Setup script for AI News Scraper
Handles installation and initial configuration
"""

import os
import sys
import subprocess
import shutil
from pathlib import Path

def check_python_version():
    """Check if Python version is 3.7 or higher."""
    if sys.version_info < (3, 7):
        print("❌ Python 3.7 or higher is required")
        print(f"Current version: {sys.version}")
        return False
    print(f"✅ Python version: {sys.version.split()[0]}")
    return True

def install_requirements():
    """Install required packages."""
    print("📦 Installing required packages...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ All packages installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install packages: {e}")
        return False

def setup_environment():
    """Set up environment file."""
    env_file = Path(".env")
    env_example = Path(".env.example")
    
    if env_file.exists():
        print("✅ .env file already exists")
        return True
    
    if env_example.exists():
        print("📝 Creating .env file from template...")
        shutil.copy(env_example, env_file)
        print("⚠️  Please edit .env file and add your ANTHROPIC_API_KEY")
        return True
    else:
        print("❌ .env.example file not found")
        return False

def create_directories():
    """Create necessary directories."""
    directories = ["reports", "logs"]
    
    for directory in directories:
        Path(directory).mkdir(exist_ok=True)
        print(f"✅ Created directory: {directory}")

def test_installation():
    """Test if the installation works."""
    print("🧪 Testing installation...")
    try:
        # Test imports
        import requests
        import beautifulsoup4
        import anthropic
        import feedparser
        from dotenv import load_dotenv
        
        print("✅ All imports successful")
        
        # Check if .env file has API key
        load_dotenv()
        api_key = os.getenv('ANTHROPIC_API_KEY')
        
        if not api_key or api_key == 'your_anthropic_api_key_here':
            print("⚠️  ANTHROPIC_API_KEY not configured in .env file")
            print("   Please edit .env file and add your actual API key")
            return False
        else:
            print("✅ ANTHROPIC_API_KEY configured")
            return True
            
    except ImportError as e:
        print(f"❌ Import error: {e}")
        return False

def main():
    """Main setup function."""
    print("🚀 Setting up AI News Scraper...")
    print("=" * 50)
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Install requirements
    if not install_requirements():
        sys.exit(1)
    
    # Setup environment
    if not setup_environment():
        sys.exit(1)
    
    # Create directories
    create_directories()
    
    # Test installation
    if test_installation():
        print("\n" + "=" * 50)
        print("✅ Setup completed successfully!")
        print("\nNext steps:")
        print("1. Edit .env file and add your ANTHROPIC_API_KEY")
        print("2. Run: python news_scraper.py")
        print("3. Check the reports/ directory for generated reports")
    else:
        print("\n" + "=" * 50)
        print("⚠️  Setup completed with warnings")
        print("Please configure your ANTHROPIC_API_KEY in .env file")

if __name__ == "__main__":
    main()
