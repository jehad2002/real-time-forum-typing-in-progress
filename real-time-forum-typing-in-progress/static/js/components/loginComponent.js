export function createLoginElement() {
    const loginElement = document.createElement("div");
    loginElement.classList.add("container", "main-container-pop");

    loginElement.innerHTML = `
        <div class="login-box">
            <div class="header">
                <h2>Login Page</h2>
            </div>
            <div class="login">
                <form  id="loginForm">
                    <div class="form-control1">
                        <input type="text"  placeholder="UserName" class="tbox" id="loginUsername" required />
                    </div>
                    <div class="form-control1">
                    <input type="password" placeholder="Password" class="tbox" title="Only uppercase letters, lowercase letters, numbers, and special characters are allowed" id="loginPassword" required />
                    </div>
                    <div id="login-error" style="display: none; color: red;">
                    Incorrect password or username
                    </div>
                    <div class="form-control1">
                        <input type="submit" value="Login Now" class="btn" />
                    </div>
                </form>

                <div class="forget-box">
                    <a class="link">Forgot password</a>
                </div>
                <div class="form-control1">
                    <p>Don't have an account? <a  id="open-popup-signup-link">Sign up</a></p>
                </div>

            </div>
        </div>
    `;

    return loginElement;
}