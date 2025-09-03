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
    
    container.appendChild(div);
  });
}

// esegui subito quando la pagina è pronta
document.addEventListener("DOMContentLoaded", renderLibrary);
