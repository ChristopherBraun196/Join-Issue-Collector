/**
 * Returns the HTML template for the login form.
 * @returns {string} HTML string of the login form
 */
export function getLoginTemplate() {
  return `
        <div class="login__form-header">
            <a href="./welcome.html" class="login__back" aria-label="Back to welcome page"><svg class="login__back-icon" width="21" height="20" viewBox="0 0 21 20" aria-hidden="true"><path d="M4.27563 8.48509H19.1716C19.908 8.48509 20.505 9.08204 20.505 9.81842C20.505 10.5548 19.908 11.1518 19.1716 11.1518H4.27563L10.485 17.3611C11.0056 17.8817 11.0056 18.7258 10.485 19.2464C9.96434 19.767 9.12025 19.767 8.59963 19.2464L0.585843 11.2326C-0.195206 10.4516 -0.195204 9.18526 0.585844 8.40421L8.59963 0.39042C9.12025 -0.130201 9.96434 -0.1302 10.485 0.39042C11.0056 0.911041 11.0056 1.75513 10.485 2.27575L4.27563 8.48509Z" fill="currentColor"/></svg></a>
            <h1>Log in</h1>
            <div class="login__divider"></div>
        </div>

        <form class="login__form" data-form="login" novalidate>
            <div class="login__fields">
                <div class="login__field">
                    <div class="login__input login__input--email">
                        <input class="login__input-field" type="email" placeholder="Email" name="email" autocomplete="additional-name" data-validate="email"/>
                        <span><img class="login__icon" src="./assets/icons/mail.svg" alt="Email icon"></span>
                    </div>
                    <span class="login__error login__error--email"></span>
                </div>
                <div class="login__field">
                    <div class="login__input login__input--password">
                        <input class="login__input-field" type="password" placeholder="Password" name="password" data-validate="password" data-pwd-input/>
                        <span class="login__lock"><img class="login__icon" src="./assets/icons/lock.svg" alt="Lock icon"></span>
                        <button type="button" class="login__pwd-toggle" data-action="toggle-pwd" tabindex="-1">
                            <img class="login__icon login__eye login__eye--off" src="./assets/icons/visibility-off.svg" alt="Hide password">
                            <img class="login__icon login__eye login__eye--on" src="./assets/icons/visibility-on.svg" alt="Show password">
                        </button>
                    </div>
                    <span class="login__error login__error--password"></span>
                </div>
            </div>
            <div class="login__buttons">
                <button class="primary-btn login__btn" type="submit">Log in</button>
                <button class="login__btn login__btn--secondary" type="button" data-action="guest-login">Guest Log in</button>
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
    
        <div class="login__form-header">
            <span data-action="show-login" class="login__back" aria-label="Back to login"><svg class="login__back-icon" width="21" height="20" viewBox="0 0 21 20" aria-hidden="true"><path d="M4.27563 8.48509H19.1716C19.908 8.48509 20.505 9.08204 20.505 9.81842C20.505 10.5548 19.908 11.1518 19.1716 11.1518H4.27563L10.485 17.3611C11.0056 17.8817 11.0056 18.7258 10.485 19.2464C9.96434 19.767 9.12025 19.767 8.59963 19.2464L0.585843 11.2326C-0.195206 10.4516 -0.195204 9.18526 0.585844 8.40421L8.59963 0.39042C9.12025 -0.130201 9.96434 -0.1302 10.485 0.39042C11.0056 0.911041 11.0056 1.75513 10.485 2.27575L4.27563 8.48509Z" fill="currentColor"/></svg></span>
            <h1>Sign Up</h1>
            <div class="login__divider"></div>
        </div>

        <form class="login__form" data-form="signup" novalidate>
            <div class="login__fields">
                <div class="login__field">
                    <div class="login__input login__input--name">
                        <input class="login__input-field" type="text" placeholder="Full Name" name="fullname" autocomplete="name" data-validate="fullname"/>
                        <span><img class="login__icon" src="./assets/icons/person.svg" alt="User icon"></span>
                    </div>
                    <span class="login__error login__error--fullname"></span>
                </div>

                <div class="login__field">
                    <div class="login__input login__input--email">
                        <input class="login__input-field" type="email" placeholder="Email" name="email" autocomplete="email" data-validate="email"/>
                        <span><img class="login__icon" src="./assets/icons/mail.svg" alt="Email icon"></span>
                    </div>
                    <span class="login__error login__error--email"></span>
                </div>

                <div class="login__field">
                    <div class="login__input login__input--password">
                        <input class="login__input-field" type="password" placeholder="Password" name="password" data-validate="password" data-pwd-input/>
                        <span class="login__lock"><img class="login__icon" src="./assets/icons/lock.svg" alt="Lock icon"></span>
                        <button type="button" class="login__pwd-toggle" data-action="toggle-pwd" tabindex="-1">
                            <img class="login__icon login__eye login__eye--off" src="./assets/icons/visibility-off.svg" alt="Hide password">
                            <img class="login__icon login__eye login__eye--on" src="./assets/icons/visibility-on.svg" alt="Show password">
                        </button>
                    </div>
                    <span class="login__error login__error--password"></span>
                </div>

                <div class="login__field">
                    <div class="login__input login__input--password">
                        <input class="login__input-field" type="password" placeholder="Confirm Password" name="password_confirm" data-validate="confirm" data-pwd-input/>
                        <span class="login__lock"><img class="login__icon" src="./assets/icons/lock.svg" alt="Lock icon"></span>
                        <button type="button" class="login__pwd-toggle" data-action="toggle-pwd" tabindex="-1">
                            <img class="login__icon login__eye login__eye--off" src="./assets/icons/visibility-off.svg" alt="Hide password">
                            <img class="login__icon login__eye login__eye--on" src="./assets/icons/visibility-on.svg" alt="Show password">
                        </button>
                    </div>
                    <span class="login__error login__error--password-confirm"></span>
                </div>
                <div class="login__field">
                    <div class="login__accept">
                        <input type="checkbox" class="login__checkbox"/><p>I accept the <a class="highlighted" href="./legal.html">Privacy policy</a></p>
                    </div>
                    <span class="login__error login__error--center login__error--accept"></span>
                </div>
            </div>

            <div class="login__buttons">
                <button class="primary-btn login__btn" type="submit">Sign Up</button>
            </div>
        </form>
    `;
}
