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
              <img src="${coverURL}" alt="Copertina di ${titolo}" width="100">
              <h3>${titolo}</h3>
              <p>${autore}</p>`;

            results.appendChild(div);
    });
}