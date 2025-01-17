import os

from dotenv import load_dotenv
from flask import Blueprint

from .spotify import SpotifyAPI

load_dotenv()

main = Blueprint('main', __name__)
spotify = SpotifyAPI(os.environ.get('SPOTIFY_CLIENT_ID'), os.environ.get('SPOTIFY_CLIENT_SECRET'))

from . import routes
