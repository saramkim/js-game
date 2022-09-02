const intro = document.getElementById("intro")!;
intro.style.position = "fixed";
intro.textContent = "Press 'Enter' to start!";
intro.style.fontSize = "50px";
intro.style.fontWeight = "700";

intro.style.top = "45%";
intro.style.left = "50%";

document.addEventListener(
  "keydown",
  (key) => key.code === "Enter" && (intro.style.display = "none")
);
