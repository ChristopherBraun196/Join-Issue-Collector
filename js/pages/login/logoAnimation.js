/**
 * Prepares the intro animation and reveals the navbar logo once it has finished.
 */
export function initLogoAnimation() {
  setLogoAnimationTarget();
  document.querySelector(".login__intro").addEventListener("animationend", handleIntroEnd);
}

/**
 * Measures the hidden navbar logo, so the intro logo knows where to fly to.
 * The logo is briefly made measurable without becoming visible.
 */
function setLogoAnimationTarget() {
  const logo = document.querySelector(".login__logo");
  logo.style.visibility = "hidden";
  logo.classList.remove("login__logo--hidden");
  setLogoTargetVariables(logo.getBoundingClientRect());
  logo.classList.add("login__logo--hidden");
  logo.style.visibility = "";
}

/**
 * Stores the target position and size of the navbar logo as CSS variables for the keyframes.
 * @param {DOMRect} rect - The bounding box of the navbar logo
 */
function setLogoTargetVariables(rect) {
  const root = document.documentElement.style;
  root.setProperty("--logo-x", `${rect.left + rect.width / 2 - window.innerWidth / 2}px`);
  root.setProperty("--logo-y", `${rect.top + rect.height / 2 - window.innerHeight / 2}px`);
  root.setProperty("--logo-w", `${rect.width}px`);
  root.setProperty("--logo-h", `${rect.height}px`);
}

/**
 * Hides the intro overlay and shows the navbar logo when the overlay animation has ended.
 * @param {AnimationEvent} event - The animationend event
 */
function handleIntroEnd(event) {
  const intro = event.currentTarget;
  if (event.target !== intro) return;
  intro.style.display = "none";
  document.querySelector(".login__logo").classList.remove("login__logo--hidden");
}
