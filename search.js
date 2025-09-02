document.getElementById("btn-search").addEventListener("click", searchBook);

async function searchBook() {
    const query = document.getElementById('search').value.trim().toLowerCase(); // query = valore inserito dall''utente ma ppulito (trim e toLowerCase)
    const results = document.getElementById('results');

    results.innerHTML = ''; 

    if (!query) {
        results.textContent = "Please insert an ISBN or a title.";
        return; // return fa 2 cose restituisce il valore successivo es return restituisce undefined; return "ciao" restituisce ciao e poi blocca la funzione (searchBook in questo caso) ciò che viene dopppo il return ma devtro la funzione non viene eseguito
    }

    try { // rova se non funziona (catch error) esci dal try e fai il catch
        const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`); //`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}` = "https://openlibrary.org/search.json?q=" + encodeURIComponent(query),  vale oer tutte le strine in js `Ciao ${nome}, benvenuta!`= "ciao"+nome+", benvenuta!"
        const data = await response.json(); // data = risosta API

        const dataCover = data.docs.filter(book => book.cover_i);

        const books = dataCover.slice(0, 8); // docs = array contenuto nell’oggetto JSON restituito dall’API.
                                                  // slice() = crea un nuovo array rendendo larray data e tagliandolo
                                                  // books è un array dentro una costante osso maniolarlo come un array ma non posso riassegnarlo
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
              <p>${autore}</p>
            `;

            results.appendChild(div);
    });
    }

    catch (error) {
        console.error("Error fetching data", error);
        results.textContent = "Error fetching data. Please try again later.";
    }
}