let body = document.querySelector('body');


let cyclingAlbums = (data) => {
    let carousel = document.querySelector('.carousel-slides');

    for (let i = 0; i < data.length; i++)
    {
        let artistName = data[i].artist;
        let artistURL = data[i].url;
        let albumName = data[i].album;
        let albumCover = data[i].cover_image;
        let albumReview = data[i].review.content;

        let slide = document.createElement('div');
        slide.classList.add('slide');

        let albumTitle = document.createElement('h2');
        albumTitle.textContent = `${albumName}`;
        slide.appendChild(albumTitle)

        let albumArtist = document.createElement('a')
        albumArtist.href = artistURL;
        albumArtist.target = '_blank';
        albumArtist.textContent = artistName;

        let albumImg = document.createElement('img');
        albumImg.src = albumCover.path;
        albumImg.alt = albumCover.alt_content;
        slide.appendChild(albumImg);

    }

}

const script = document.createElement(`script`);
script.setAttribute(`src`, `json/data.json`);
carousel-slides.appendChild(script);
