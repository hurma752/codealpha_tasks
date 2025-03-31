const imagesWrapper = document.querySelector(".images");
const loadMoreBtn = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-box input");
const lightbox = document.querySelector(".lightbox");
const closeBtn = document.querySelector(".uil-times");
const downloadImgBtn = document.querySelector(".uil-import");

const apiKey = "AcZmwFxjXVsPCucL6mKuAARdolE6efKZefP78yHAiuVbQ02VtIpabbVD";
const perPage = 15;
let currentPage = 1;
let searchItem = null;

const downloadImg = (imgSrc) => {
    fetch(imgSrc)
        .then(res => res.blob())
        .then(file => {
            const a = document.createElement("a");
            a.href = URL.createObjectURL(file);
            a.download = new Date().getTime() + ".jpg";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        })
        .catch(() => alert("Error downloading image!"));
};

window.downloadImg = downloadImg;

const showLightbox = (imgSrc) => {
    const lightboxImg = lightbox.querySelector("img");
    if (lightboxImg) {
        lightboxImg.src = imgSrc;
    }

    lightbox.classList.add("show");
    document.body.style.overflow = "hidden";

    downloadImgBtn.onclick = () => downloadImg(imgSrc);
};

window.showLightbox = showLightbox;

const hidelightBox = () => {
    lightbox.classList.remove("show");
    document.body.style.overflow = "auto";
};

const generateHTML = (images) => {
    imagesWrapper.innerHTML += images.map(img =>
        `<li class="card" onclick="showLightbox('${img.src.large2x}')">
            <img src="${img.src.large2x}" alt="img">
            <div class="details">
                <div class="photographer">
                    <i class="uil uil-camera"></i>
                    <span>${img.photographer}</span>
                </div>
                <button onclick="event.stopPropagation(); downloadImg('${img.src.large2x}')">
                    <i class="uil uil-import"></i>
                </button>
            </div>
        </li>`
    ).join("");
};

const getImages = (apiURL) => {
    loadMoreBtn.innerText = "Loading...";
    loadMoreBtn.classList.add("disabled");

    fetch(apiURL, {
        headers: { Authorization: apiKey }
    })
    .then(res => res.json())
    .then(data => {
        generateHTML(data.photos);
        loadMoreBtn.innerText = "Load More";
        loadMoreBtn.classList.remove("disabled");
    })
    .catch(err => console.error("Error fetching images:", err));
};

getImages(`https://api.pexels.com/v1/curated?per_page=${perPage}`);

const loadMoreImages = () => {
    currentPage++;
    const apiURL = searchItem 
        ? `https://api.pexels.com/v1/search?query=${searchItem}&per_page=${perPage}&page=${currentPage}`
        : `https://api.pexels.com/v1/curated?per_page=${perPage}&page=${currentPage}`;
    getImages(apiURL);
};

loadMoreBtn.addEventListener("click", loadMoreImages);

const loadImagesSearch = (e) => {
    if (e.key === "Enter") {
        currentPage = 1;
        imagesWrapper.innerHTML = "";

        searchItem = searchInput.value.trim();
        
        if (searchItem === "") {
            searchItem = null;
            getImages(`https://api.pexels.com/v1/curated?per_page=${perPage}`);
        } else {
            getImages(`https://api.pexels.com/v1/search?query=${searchItem}&per_page=${perPage}&page=${currentPage}`);
        }
    }
};

searchInput.addEventListener("keyup", loadImagesSearch);
closeBtn.addEventListener("click", hidelightBox);



