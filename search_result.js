function renderBooks(books) { 
    const results = document.getElementById("results");
    results.innerHTML = "";

    if (books.length === 0) {
        results.textContent = "No books found.";
        return;
    }   

        books.forEach(book => {
            const div = document.createElement("div");
            div.classList.add("book");

            const titolo = book.title || "Title not available";
            const autore = book.author_name ? book.author_name.join(", ") : "Author not available";
            let coverURL = book.cover_i
              ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
              : "img/default-cover.jpg";

            div.innerHTML = `
              <img src="${escapeHtml(coverURL)}" alt="Copertina di ${escapeHtml(titolo)}" width="100">
              <h3>${escapeHtml(titolo)}</h3>
              <p>${escapeHtml(autore)}</p>
              <div style="display: flex; flex-direction: row;">
                <button class="add-btn"> <span class="material-symbols-outlined">add_2 </span> </button> 
                <p>Add to my library</p>
              </div>`;

            div.querySelector(".add-btn").addEventListener("click", () => {
            addToLibrary({
              isbn: isbn,
              title: book.title,
              author: book.author,
              cover: book.cover
            });
          });

            results.appendChild(div);
    });
}

function addToLibrary(book) {
  // recupera la libreria attuale da localStorage
  let library = JSON.parse(localStorage.getItem("myLibrary")) || [];

  // evita duplicati (controlla ISBN)
  if (!library.some(b => b.isbn === book.isbn)) {
    library.push(book);
    localStorage.setItem("myLibrary", JSON.stringify(library));
    alert(`${book.title} added to your library!`);
  } else {
    alert("This book is already in your library.");
  }
}