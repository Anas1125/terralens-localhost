import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User, Eye, EyeOff } from "lucide-react";
import { login } from "../../api/admin";
import { scheduleTokenLogout } from "../../api/client";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

    useEffect(() => {
    if (lockoutSeconds <= 0) return;

    const timer = setInterval(() => {
      setLockoutSeconds((seconds) => {
        if (seconds <= 1) {
          clearInterval(timer);
          setError("");
          return 0;
        }

        return seconds - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  const formatLockoutTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoggingIn(true);

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
      if (err.response?.status === 429) {
        const retryAfter = Number(
          err.response?.headers?.["retry-after"]
        );

        if (retryAfter > 0) {
          setLockoutSeconds(retryAfter);
          setError("Too many login attempts.");
        } else {
          setError(
            "Too many login attempts. Please try again later."
          );
        }
      } else {
        setError("Invalid username or password");
      }
    } finally {
      setLoggingIn(false);
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
            onChange={(e) => {
              setUsername(e.target.value);

              if (lockoutSeconds <= 0) {
                setError("");
              }
            }}
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
            onChange={(e) => {
              setPassword(e.target.value);

              if (lockoutSeconds <= 0) {
                setError("");
              }
            }}
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

        {error && (
          <div
            className="
              mt-4
              rounded-xl
              border
              border-red-200
              bg-red-50
              px-4
              py-3
              text-sm
              font-medium
              text-red-600
            "
            role="alert"
          >
            <div>{error}</div>

            {lockoutSeconds > 0 && (
              <div className="mt-1">
                Please try again in{" "}
                <span className="font-bold">
                  {formatLockoutTime(lockoutSeconds)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Login Button */}

        <button
          type="submit"
          disabled={loggingIn || lockoutSeconds > 0}
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
            cursor-pointer
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {loggingIn
            ? "Logging in..."
            : lockoutSeconds > 0
            ? `Try again in ${formatLockoutTime(lockoutSeconds)}`
            : "Login"}
        </button>
      </form>
    </div>
  );
}