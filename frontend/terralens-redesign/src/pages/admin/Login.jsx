import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User, Eye, EyeOff } from "lucide-react";
import { login } from "../../api/admin";
import { scheduleTokenLogout } from "../../api/client";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await login(username, password);

      localStorage.setItem(
        "adminToken",
        data.access_token
      );

      localStorage.setItem(
        "adminRole",
        data.role
      );

      scheduleTokenLogout();

      navigate("/admin/dashboard");
    } catch (err) {
      alert("Invalid username or password");
    }
  };

  return (
    <div
      className="
        relative
        min-h-screen
        w-full
        overflow-hidden
        bg-slate-50
        flex
        items-center
        justify-center
        px-6
      "
    >
      {/* Background Glow */}

      <div
        className="
          absolute
          left-1/2
          top-1/2
          -translate-x-1/2
          -translate-y-1/2
          w-[600px]
          h-[600px]
          rounded-full
          bg-sky-500/10
          blur-[180px]
          pointer-events-none
        "
      />

      {/* Login Form */}

      <form
        onSubmit={handleLogin}
        className="
          relative
          z-10
          w-full
          max-w-md
          rounded-3xl
          border
          border-slate-200
          bg-white
          p-10
          shadow-[0_20px_60px_rgba(15,23,42,0.08)]
        "
      >
        {/* Header */}

        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900">
            TerraLens CMS
          </h1>

          <p className="mt-3 text-slate-500">
            Administrator Login
          </p>
        </div>

        {/* Username */}

        <div className="relative mt-10">
          <User
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-slate-400
            "
            size={20}
          />

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            className="
              w-full
              rounded-xl
              bg-slate-50
              border
              border-slate-200
              pl-12
              pr-4
              py-4
              text-slate-900
              placeholder-slate-400
              focus:border-sky-500
              focus:ring-2
              focus:ring-sky-500/20
              focus:outline-none
              transition
            "
          />
        </div>

        {/* Password */}

        <div className="relative mt-5">
          <Lock
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-slate-400
            "
            size={20}
          />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full
              rounded-xl
              bg-slate-50
              border
              border-slate-200
              pl-12
              pr-12
              py-4
              text-slate-900
              placeholder-slate-400
              focus:border-sky-500
              focus:ring-2
              focus:ring-sky-500/20
              focus:outline-none
              transition
            "
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="
              absolute
              right-4
              top-1/2
              -translate-y-1/2
              text-slate-400
              hover:text-slate-600
              transition
            "
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </button>
        </div>

        {/* Login Button */}

        <button
          type="submit"
          className="
            mt-8
            w-full
            rounded-xl
            bg-sky-500
            py-4
            text-white
            font-semibold
            transition-all
            duration-300
            hover:bg-sky-400
            hover:shadow-[0_0_35px_rgba(14,165,233,.35)]
            hover:-translate-y-0.5
          "
        >
          Login
        </button>
      </form>
    </div>
  );
}