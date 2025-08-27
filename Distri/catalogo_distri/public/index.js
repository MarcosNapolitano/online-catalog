(function init() {

  const turnOff = () => {

    navbar.classList.remove("anim-in");
    navbar.classList.add("anim-out");
    setTimeout(() => {

      navbar.classList.add("hidden");
      navbar.classList.remove("anim-out");

    }, 950);
  };

  const turnOn = () => {

    navbar.classList.remove("hidden");
    navbar.classList.add("anim-in");

    setTimeout(() => {

      navbar.classList.remove("anim-in");

    }, 950);

  };

  const h2 = document.getElementById("close-menu");
  h2.addEventListener("click", turnOff);

  const navbar = document.getElementById("navbar");

  const toggle = document.getElementById("menu-toggle");
  toggle.addEventListener("click", turnOn);

  const sections = document.getElementsByTagName("section");

  for (let i = 0; i < sections.length; i++){
    sections[i].addEventListener("click", turnOff)
  };
  
})();
