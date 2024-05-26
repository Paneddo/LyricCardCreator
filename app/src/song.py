import re


def format_feats(primary_artist, featured_artists):
    if not featured_artists:
        return primary_artist
    return f"{primary_artist} & {', '.join([art.get('name') for art in featured_artists])}"


def remove_song_feat(s):
    s = re.sub(r'-\s+(feat|with|prod|ft|con).*', '', s, flags=re.IGNORECASE)
    s = re.sub(r'(\(|\[)(feat|with|prod|ft|con)\.?\s+.*(\)|\])$', '', s, flags=re.IGNORECASE)
    return s.strip()


def parse_song_item(item: dict) -> dict:
    title = item.get('name')
    title_no_feats = remove_song_feat(title)
    artists = item.get('artists', [{}])
    artist = artists[0].get('name')
    feats = format_feats(artist, artists[1:])
    album = item.get('album', {}).get('name')
    image = item.get('album', {}).get('images', [{}])[0].get('url')
    return {'title': title, 'title_no_feats': title_no_feats, 'artist': artist, 'feats': feats, 'album': album, 'image': image}
