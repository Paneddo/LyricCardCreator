import os
from datetime import timedelta


class ApplicationConfig:
    SECRET_KEY = os.environ.get('SECRET_KEY')

    SESSION_TYPE = 'filesystem'
    SESSION_PERMANENT = True
    PERMANENT_SESSION_LIFETIME = timedelta(minutes=2)
