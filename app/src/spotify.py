import time

import requests

from app.src.song import parse_song_item

API_URL = 'https://spotify-lyrics-api-pi.vercel.app'


class SpotifyAPI:
    def __init__(self, client_id, client_secret):
        self.client_id = client_id
        self.client_secret = client_secret
        self.base_url = 'https://api.spotify.com/v1/'
        self.access_token = None
        self.token_expires_at = 0

    def get_access_token(self):
        if time.time() > self.token_expires_at:
            auth_url = 'https://accounts.spotify.com/api/token'
            auth_response = requests.post(
                auth_url,
                {
                    'grant_type': 'client_credentials',
                    'client_id': self.client_id,
                    'client_secret': self.client_secret,
                },
            )

            if auth_response.status_code == 200:
                response_data = auth_response.json()
                self.access_token = response_data['access_token']
                self.token_expires_at = time.time() + response_data['expires_in']
            else:
                raise Exception("Failed to retrieve access token")

        return self.access_token

    def search_song(self, query, limit):
        access_token = self.get_access_token()

        search_url = self.base_url + 'search'
        headers = {'Authorization': f'Bearer {access_token}'}
        params = {'q': query, 'limit': limit, 'type': 'track', 'market': 'IT'}

        response = requests.get(search_url, headers=headers, params=params)

        if response.ok:
            items = response.json()['tracks']['items']
            songs = {item['id']: parse_song_item(item) for item in items}

            return songs

        else:
            raise Exception("Failed to search for song")

    def get_lyrics(self, trackid):
        r = requests.get(API_URL, params={'trackid': trackid, 'format': 'lrc'})
        data = r.json()

        if data['error']:
            return None

        return [line['words'] for line in data['lines']][:-1]

    def get_song_by_id(self, song_id):
        access_token = self.get_access_token()

        song_url = self.base_url + 'tracks/' + song_id
        headers = {'Authorization': f'Bearer {access_token}'}

        response = requests.get(song_url, headers=headers)

        if response.ok:
            song = parse_song_item(response.json())
            return song
        else:
            raise Exception("Failed to get song by ID")
