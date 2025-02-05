export function createRegisterElement() {
    const registerElement = document.createElement("div");
    registerElement.innerHTML = `
        <span class="close" id="close-signup">&times;</span>
        <div class="container main-container-pop">
            <div class="signup-box">
                <div class="header">
                    <h2>Sign Up Page</h2>
                </div>
                <div class="signup">
                    <form  id="registerForm"> 
                        <div class="form-control1">
                            <input type="text" name="name" placeholder="Name" class="tbox" required />
                        </div>
                        <div class="form-control1">
                            <input type="text" name="username" placeholder="Username" class="tbox" required />
                        </div>
                        <div class="form-control1">
                            <input type="email" name="email" placeholder="Email" class="tbox" required />
                        </div>
                        <div class="form-control1">
                            <input type="password" minlength="3" name="password" placeholder="Password" class="tbox" required />
                        </div>
                        <div class="form-control1">
                            <input type="number" name="age" placeholder="Age" min="1" class="tbox" required />
                        </div>
                        <div class="form-control1">
                            <label for="gender">Gender:</label>
                            <select name="gender" id="gender" class="tbox" required>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div class="form-control1">
                            <input type="text" name="first_name" placeholder="First Name" class="tbox" required />
                        </div>
                        <div class="form-control1">
                            <input type="text" name="last_name" placeholder="Last Name" class="tbox" required />
                        </div>
                  
                        <div id="register-error" style="display: none; color: red;">
                            Registration failed
                        </div>
                        <div class="form-control1">
                            <input type="submit" value="Sign Up Now" class="btn" />
                        </div>
                    </form>
                    <div class="form-control1">
                        <button id="google-signup-button"><i class="fab fa-google"></i> Sign Up with Google</button>
                    </div>
                    <div class="form-control1">
                        <p>Already have an account?<a   id="open-popup-login"> Log in</a></p>
                    </div>
                </div>
            </div>
        </div>
    `;

    return registerElement;
}
