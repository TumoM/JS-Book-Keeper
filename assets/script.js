const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = [];

// Show Modal, Focus on 1st Modal Input
function showModal() {
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}


// Model Event Listiners
modalShow.addEventListener('click', showModal)
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
window.addEventListener('click', (e) => e.target === modal ? modal.classList.remove('show-modal') : false);

// Validate Form
function validate(nameValue, urlValue) {
    const expression = /(https)?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    if (!nameValue || !urlValue) {
      alert('Please submit values for both fields.');
      return false;
    }
    if (!urlValue.match(regex)) {
      alert('Please provide a valid web address.');
      return false;
    }
    // Valid
    return true;
  }

// Build Bookmarks DOM
function buildBookmarks() {
    // Remove all bookmark elements
    bookmarksContainer.textContent = '';
    // Build items
    bookmarks.forEach((bookmark) => {
        const { name, url } = bookmark;
        // Item
        const item = document.createElement('div');
        item.classList.add('item');
        // Close Icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas', 'fa-times-circle');
        closeIcon.setAttribute('title','Delete Bookmark');
        closeIcon.setAttribute('onclick',`deleteBookmark('${url}')`);
        // Favicon / Link Container
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');

        const favicon = document.createElement('img');
        favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain_url=${url}`);
        favicon.setAttribute('alt', 'Favicon')

        const link = document.createElement('a');
        link.setAttribute('href', `${url}`)
        link.setAttribute('target', `-blank`)
        link.textContent = name;

        // Append to bookmarks
        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
        bookmarksContainer.appendChild(item);
    });
    
}

//   Fetch Bookmarks
function fetchBookmarks() {
    // Get bookmarks from localStorage if available
    if (updateLocalStorage("get", "bookmarks")){
        bookmarks = updateLocalStorage("get", "bookmarks");
    } else {
        bookmarks = [
            {
                name: 'Google',
                url: 'https://www.google.com',
            }
        ];
        updateLocalStorage('set', 'bookmarks', bookmarks);
    }
    buildBookmarks();
}

// Delete Bookmark
function deleteBookmark(url = "") {
    const newBookmarsArr = bookmarks.filter((bookmark, i) => {
        console.log(`Running filter time ${i+1}`)
        return bookmark.url!== url;
    })
    bookmarks.find((bookmark, i) => {
        if (bookmark.url === url) {
            console.log(`Running find time ${i+1}`)
            bookmarks.splice(i,1);
            return true;
        }
    })
    updateLocalStorage('set', 'bookmarks', bookmarks);
    /* bookmarks.length > 0 ? updateLocalStorage('set', 'bookmarks', bookmarks):
    updateLocalStorage('remove','bookmarks'); */
    fetchBookmarks();

}

// Handle Data from Form
function storeBookmark(e = SubmitEvent.prototype) {
    e.preventDefault();
    const nameVal = websiteNameEl.value.trim();
    let urlVal = websiteUrlEl.value.trim();
    const expression = "/^https?:\/\//i"
    const regex = new RegExp(expression)
    if (!regex.test(urlVal)) {
        urlVal = 'https://' + urlVal;
    }
    console.log({nameVal,urlVal});
    if (!validate(nameVal, urlVal)){
        return false;
    };
    bookmarks.push({
        name: nameVal,
        url: urlVal,
    });
    updateLocalStorage('set', 'bookmarks', bookmarks);
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();
}

// Event Listiners
bookmarkForm.addEventListener('submit', storeBookmark);

// On Load, Fetch Bookmarks
fetchBookmarks();

// Localstorage Helper Function
function updateLocalStorage(action, key="", value="") {
    switch(action) {
        case 'set':
            localStorage.setItem(key, JSON.stringify(value));
            break;
        case 'remove':
            localStorage.removeItem(key);
            break;
        case 'get':
            return JSON.parse(localStorage.getItem(key));
        case 'clear':
            localStorage.clear();
            break;
        default:
            console.log('Invalid action. Please use "set", "remove", "get", or "clear".');
    }
}
