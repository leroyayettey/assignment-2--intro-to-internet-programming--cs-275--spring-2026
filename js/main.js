let body = document.querySelector(`body`);
let carousel = document.querySelector(`.carousel-slides`);
let previousArrow = document.querySelector(`.carousel-navigation a:first-child`);
let nextArrow = document.querySelector(`.carousel-navigation a:last-child`);

let currentAlbumSlideIndex = 0;
let totalAlbumSlides = 0;

let listOfAlbums = (data) => {

    for (let i = 0; i < data.length; i++)
    {
        let artistName = data[i].artist;
        let artistURL = data[i].url;
        let albumName = data[i].album;
        let albumCover = data[i].cover_image;
        let albumCreditReference = data[i].cover_image.credit;
        let albumReview = data[i].review.content;
        let albumReviewReference = data[i].review.source;

        let slide = document.createElement('div');
        slide.classList.add(`slide`);

        let albumTitle = document.createElement('h2');
        albumTitle.textContent = `${albumName}`;
        slide.appendChild(albumTitle);

        let albumArtist = document.createElement(`a`);
        albumArtist.href = artistURL;
        albumArtist.target = `_blank`;
        albumArtist.textContent = artistName;
        slide.appendChild(albumArtist);

        let albumImg = document.createElement('img');
        albumImg.src = albumCover.path;
        albumImg.alt = albumCover.alt_content;
        slide.appendChild(albumImg);

        let albumCredit = document.createElement('a');
        albumCredit.href = data[i].cover_image.url;
        albumCredit.textContent = `Credit -> ` + albumCreditReference;
        slide.appendChild(albumCredit);

        let reviewParagraph = document.createElement('p');
        reviewParagraph.textContent = albumReview;
        slide.appendChild(reviewParagraph);

        let albumReviewSource = document.createElement('a');
        albumReviewSource.href = data[i].review.url;
        albumReviewSource.textContent = `— ` + albumReviewReference;
        slide.appendChild(albumReviewSource);

        carousel.appendChild(slide);
    }
    totalAlbumSlides = data.length;
    removeArrowVisiblity();
}

let removeArrowVisiblity = () => {
    if (currentAlbumSlideIndex === 0){
        previousArrow.style.display = `none`;
    }
    else{
        previousArrow.style.display = `block`;
    }

    if (currentAlbumSlideIndex === totalAlbumSlides - 1){
        nextArrow.style.display = `none`;
    }
    else{
        nextArrow.style.display = `block`;
    }

};

let shiftAlbumCarousel = () => {
    carousel.style.transform = `translateX(-${currentAlbumSlideIndex * 640}px)`;
    removeArrowVisiblity();
}

nextArrow.addEventListener(`click`, (e) => {
    e.preventDefault();
    if (currentAlbumSlideIndex < totalAlbumSlides - 1){
        currentAlbumSlideIndex++;
        shiftAlbumCarousel();
    }
    else{
        removeArrowVisiblity();
    }
});

previousArrow.addEventListener(`click`, (e) => {
    e.preventDefault();
    if (currentAlbumSlideIndex > 0){
        currentAlbumSlideIndex--;
        shiftAlbumCarousel();
    }
    else{
        removeArrowVisiblity();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === `ArrowRight`) nextArrow.click();
    if (e.key === `ArrowLeft`) previousArrow.click();
});

const script = document.createElement(`script`);
script.setAttribute(`src`, `json/data.json`);
document.body.appendChild(script);
