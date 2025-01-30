import Link from "next/link";
import React from "react";

/**
 * Login Component.
 *
 * This component provides links for signing up and logging in.
 *
 * @returns {JSX.Element} The rendered Login component.
 */
function Login() {
  return (
    <div>
      <Link href="/api/auth/signin">
        <button>Sign up</button>
      </Link>
      <Link href="/api/auth/signin">
        <button>Log in</button>
      </Link>
    </div>
  );
}

export default Login;
