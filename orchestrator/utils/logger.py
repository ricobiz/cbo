
import logging
import sys
from typing import Optional

def setup_logger(name: str = "orchestrator", log_level: Optional[str] = None) -> logging.Logger:
    """
    Set up logger with specified configuration
    """
    # Determine log level
    level_map = {
        "DEBUG": logging.DEBUG,
        "INFO": logging.INFO,
        "WARNING": logging.WARNING,
        "ERROR": logging.ERROR,
        "CRITICAL": logging.CRITICAL
    }
    
    level = level_map.get(log_level, logging.INFO)
    
    # Create logger
    logger = logging.getLogger(name)
    logger.setLevel(level)
    
    # Create console handler with formatting
    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(level)
    
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    handler.setFormatter(formatter)
    
    # Add handler to logger
    logger.addHandler(handler)
    
    return logger
