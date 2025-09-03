const html5QrCode = new Html5Qrcode("reader");
const startBtn = document.getElementById("btn-start-scan");
const stopBtn = document.getElementById("btn-stop-scan");
const scanStatus = document.getElementById("scan-status");
startBtn.addEventListener("click", async () => {
  scanStatus.textContent = "Richiesta permesso fotocamera…";
  startBtn.disabled = true;

  const config = { 
    fps: 10, 
    qrbox: { width: 300, height: 120},
    formatsToSupport: [Html5QrcodeSupportedFormats.EAN_13]
 };


  try {
    // prova a usare la camera "environment" (posteriore)
    await html5QrCode.start(
      { facingMode: { exact: "environment" } }, 
      config,
      onScanSuccess,
      onScanFailure
    );
    scanStatus.textContent = "Scanner attivo: inquadra il codice a barre.";
    stopBtn.disabled = false;
  } catch (err) {
    // fallback se exact non è supportato su alcuni dispositivi
    try {
      await html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess, onScanFailure);
      scanStatus.textContent = "Scanner attivo.";
      stopBtn.disabled = false;
    } catch (e) {
      console.error(e);
      scanStatus.textContent = "Impossibile accedere alla fotocamera. Controlla permessi o dispositivo.";
      startBtn.disabled = false;
    }
  }
});
stopBtn.addEventListener("click", async () => {
  stopBtn.disabled = true;
  scanStatus.textContent = "Arresto scanner…";
  try {
    await html5QrCode.stop();
    html5QrCode.clear();
    scanStatus.textContent = "Scanner fermato.";
  } catch (err) {
    console.error(err);
    scanStatus.textContent = "Errore nello stop dello scanner.";
  } finally {
    startBtn.disabled = false;
  }
});


async function onScanSuccess(decodedText) {
  const isbnRaw = decodedText.replace(/\D/g, "");
  if (!(isbnRaw.length === 13 && (isbnRaw.startsWith("978") || isbnRaw.startsWith("979")))) {
    scanStatus.textContent = "Codice non valido";
    return;
  }
  scanStatus.textContent = `ISBN rilevato: ${isbnRaw}. Recupero dati...`;
  performSearch(isbnRaw); //perform search userà isbnRaw come se fosse una query (input testuale )
}
