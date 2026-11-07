/**
 * Returns the HTML template for the login form.
 * @returns {string} HTML string of the login form
 */
export function getLoginTemplate() {
  return `
        <div class="form-header">
            <h1>Log in</h1>
            <div class="spacer"></div>
        </div>

        <form id="login-signup-form" onsubmit="handleLogin(event); return false;" novalidate>
            <div class="input-fields">
                <div class="field-wrapper">
                    <div class="email-input">
                        <input class="form-input" type="email" placeholder="E-Mail" name="email" autocomplete="additional-name" onblur="validateField(this, 'email-error')"/>
                        <span><img class="input-icon" src="./assets/icons/mail.svg" alt="Email icon"></span>
                    </div>
                    <span class="field-error" id="email-error"></span>
                </div>
                <div class="field-wrapper">
                    <div class="pwd-input">
                        <input class="form-input" type="password" placeholder="Password" name="password" onblur="validateField(this, 'password-error')" oninput="togglePwdVisibilityBtn(this)"/>
                        <span class="pwd-lock-icon"><img class="input-icon" src="./assets/icons/lock.svg" alt="Lock icon"></span>
                        <button type="button" class="pwd-toggle-btn" onclick="togglePwdVisibility(this)" tabindex="-1">
                            <img class="input-icon eye-off" src="./assets/icons/visibility-off.svg" alt="Hide password">
                            <img class="input-icon eye-on" src="./assets/icons/visibility-on.svg" alt="Show password">
                        </button>
                    </div>
                    <span class="field-error" id="password-error"></span>
                </div>
            </div>
            <div class="login-btns">
                <button id="login-btn" class="primary-btn btn" type="submit">Log in</button>
                <button id="guest-login-btn" class="regular-btn btn" type="button" onclick="guestLogin()">Guest Log in</button>
            </div>
        </form>
    `;
}

/**
 * Returns the HTML template for the signup form.
 * @returns {string} HTML string of the signup form
 */
export function getSignupTemplate() {
  return `
    
        <div class="form-header">
            <span onclick="switchToLogin()" class="back"><img src="./assets/icons/arrow-back.svg" /></span>
            <h1>Sign Up</h1>
            <div class="spacer"></div>
        </div>

        <form id="login-signup-form" onsubmit="handleSignup(event); return false;" novalidate>
            <div class="input-fields">
                <div class="field-wrapper">
                    <div class="name-input">
                        <input class="form-input" type="text" placeholder="Full Name" name="fullname" autocomplete="name" onblur="validateField(this, 'fullname-error')"/>
                        <span><img class="input-icon" src="./assets/icons/person.svg" alt="User icon"></span>
                    </div>
                    <span class="field-error" id="fullname-error"></span>
                </div>

                <div class="field-wrapper">
                    <div class="email-input">
                        <input class="form-input" type="email" placeholder="E-Mail" name="email" autocomplete="email" onblur="validateField(this, 'email-error')"/>
                        <span><img class="input-icon" src="./assets/icons/mail.svg" alt="Email icon"></span>
                    </div>
                    <span class="field-error" id="email-error"></span>
                </div>

                <div class="field-wrapper">
                    <div class="pwd-input">
                        <input class="form-input" type="password" placeholder="Password" name="password" onblur="validateField(this, 'password-error')" oninput="togglePwdVisibilityBtn(this)"/>
                        <span class="pwd-lock-icon"><img class="input-icon" src="./assets/icons/lock.svg" alt="Lock icon"></span>
                        <button type="button" class="pwd-toggle-btn" onclick="togglePwdVisibility(this)" tabindex="-1">
                            <img class="input-icon eye-off" src="./assets/icons/visibility-off.svg" alt="Hide password">
                            <img class="input-icon eye-on" src="./assets/icons/visibility-on.svg" alt="Show password">
                        </button>
                    </div>
                    <span class="field-error" id="password-error"></span>
                </div>

                <div class="field-wrapper">
                    <div class="pwd-input">
                        <input class="form-input" type="password" placeholder="Confirm Password" name="password_confirm" onblur="validatePasswordConfirm(this)" oninput="togglePwdVisibilityBtn(this)"/>
                        <span class="pwd-lock-icon"><img class="input-icon" src="./assets/icons/lock.svg" alt="Lock icon"></span>
                        <button type="button" class="pwd-toggle-btn" onclick="togglePwdVisibility(this)" tabindex="-1">
                            <img class="input-icon eye-off" src="./assets/icons/visibility-off.svg" alt="Hide password">
                            <img class="input-icon eye-on" src="./assets/icons/visibility-on.svg" alt="Show password">
                        </button>
                    </div>
                    <span class="field-error" id="password-confirm-error"></span>
                </div>
                <div class="field-wrapper">
                    <div class="accept-input">
                        <input type="checkbox" id="accept-btn"/><p>I accept the <a class="highlighted" href="./legal.html">Privacy policy</a></p>
                    </div>
                    <span class="field-error" id="accept-error"></span>
                </div>
            </div>

            <div class="login-btns">
                <button id="signup-btn" class="primary-btn btn" type="submit">Sign Up</button>
            </div>
        </form>
    `;
}
