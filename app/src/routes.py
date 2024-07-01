import re

from flask import redirect, render_template, request, session

from . import main, r, spotify

SPOTIFY_TRACK_URL_PATTERN = r'^https?://open\.spotify\.com/track/(\w{22})\b'


@main.route("/", methods=["GET"])
def root():
    search_query = request.args.get("query")

    if not search_query:
        return render_template("search.html", error=True)

    match = re.match(SPOTIFY_TRACK_URL_PATTERN, search_query)
    if match:
        track_id = match.group(1)
        return redirect(f"/create?id={track_id}")

    songs = spotify.search_song(query=search_query, limit=5)
    session['songs'] = songs

    return render_template("choose.html", songs=songs)


@main.route("/create", methods=['GET'], strict_slashes=False)
def create():
    song_id = request.args.get("id", "").strip()
    if not song_id:
        return redirect('/')

    r.hincrby('song_search_counts', song_id, 1)

    try:
        song = session['songs'][song_id]
    except KeyError:
        song = spotify.get_song_by_id(song_id)

    lyrics = spotify.get_lyrics(song_id)
    if lyrics is None:
        return 'Error'

    return render_template('lyrics.html', lyrics=lyrics, song=song, song_id=song_id)
