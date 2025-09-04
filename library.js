function renderLibrary() {
  const container = document.getElementById("library");
  const saved = localStorage.getItem("myLibrary");
  const library = saved ? JSON.parse(saved) : [];

  container.innerHTML = "";

  if (library.length === 0) {
    container.textContent = "Your library is empty.";
    return;
  }

  library.forEach(book => {
    const div = document.createElement("div");
    div.className = "book";

    // copertina
    if (book.cover_i) {
      const img = document.createElement("img");
      img.src = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
      img.alt = `Cover of ${book.title}`;
      div.appendChild(img);
    }

    // titolo
    const title = document.createElement("h3");
    title.textContent = book.title || "Untitled";
    div.appendChild(title); 

    // autore
    const author = document.createElement("p");
    author.textContent = book.author_name
      ? book.author_name.join(", ")
      : "Unknown author";
    div.appendChild(author);

    const removeBtn = document.createElement("button");
    removeBtn.innerHTML = "<span class='material-symbols-outlined'>delete</span>";
    div.appendChild(removeBtn);

    removeBtn.addEventListener("click", () => {
      let library = JSON.parse(localStorage.getItem("myLibrary")) || []; //prende la libreria dal local storage e se è vuoto crea un array nullo
      const bookId = book.isbn && book.isbn.length > 0 ? book.isbn[0] : book.key; // creo bookID che = isbn (se la stringa isbn deve esistere e deve essere >0) se no prendo la key (fornita sempre da OpenLibrary)

      library = library.filter(b => {
        const bId = b.isbn && b.isbn.length > 0 ? b.isbn[0] : b.key;
        return bId !== bookId;
        });
        
      localStorage.setItem("myLibrary", JSON.stringify(library)); //salvo la nuova libreria in locale
      renderLibrary();
      
    });

    container.appendChild(div);
  });
}

// esegui subito quando la pagina è pronta
document.addEventListener("DOMContentLoaded", renderLibrary);
