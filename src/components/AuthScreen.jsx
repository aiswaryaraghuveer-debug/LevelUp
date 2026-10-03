import React, { useState } from "react";
import { avatarOptions, themeOptions } from "../../data/data.js";
import AvatarSvg from "./AvatarSvg.jsx";
import BrandLogo from "./BrandLogo.jsx";
import { getRandomMotivationalQuote } from "./MotivationCard.jsx";
import { MAX_GOAL_DURATION_MONTHS, MIN_GOAL_DURATION_MONTHS } from "../utils/helperFunctions.js";

const initialForm = {
  username: "",
  password: "",
  age: "",
  goals: "",
  goalDurationMonths: String(MIN_GOAL_DURATION_MONTHS),
  avatar: avatarOptions[0]?.value || "",
  theme: "rift",
};

function AuthScreen({ onSignIn, onSignUp }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(initialForm);
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quote, setQuote] = useState(getRandomMotivationalQuote);

  function updateField(event) {
    setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }));
    setNotice("");
  }

  async function submitForm(event) {
    event.preventDefault();
    setNotice("");
    setIsSubmitting(true);
    try {
      if (mode === "login") {
        await onSignIn({ username: form.username, password: form.password });
      } else {
        const age = Number(form.age);
        const goalDurationMonths = Number(form.goalDurationMonths);
        if (!form.username.trim() || form.password.length < 8) {
          throw new Error("Choose a username and a password with at least 8 characters.");
        }
        if (!Number.isInteger(age) || age < 1 || age > 120) {
          throw new Error("Enter an age between 1 and 120.");
        }
        if (!Number.isInteger(goalDurationMonths) || goalDurationMonths < MIN_GOAL_DURATION_MONTHS || goalDurationMonths > MAX_GOAL_DURATION_MONTHS) {
          throw new Error(`Choose a goal duration from ${MIN_GOAL_DURATION_MONTHS} to ${MAX_GOAL_DURATION_MONTHS} months.`);
        }
        await onSignUp({ ...form, age, goalDurationMonths });
      }
    } catch (error) {
      setNotice(error.message || "We couldn't complete that request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    setNotice("");
    setForm(initialForm);
    setQuote((currentQuote) => getRandomMotivationalQuote(currentQuote));
  }

  return (
    <main className="auth-page" data-theme={form.theme}>
      <section className="auth-panel" aria-labelledby="auth-title">
        <div className="auth-brand-lockup">
          <BrandLogo className="auth-brand-logo" />
          <span className="auth-brand-name">Arise</span>
        </div>
        <p className="auth-eyebrow">YOUR NEXT CHAPTER STARTS HERE</p>
        <h1 id="auth-title">{mode === "login" ? "Welcome back" : "Create your hero"}</h1>
        <p className="auth-intro">
          {mode === "login" ? "Sign in to continue building your momentum." : "Set up your profile and make progress yours."}
        </p>

        <div className="auth-tabs" role="tablist" aria-label="Account access">
          <button type="button" role="tab" aria-selected={mode === "login"} onClick={() => switchMode("login")}>Sign in</button>
          <button type="button" role="tab" aria-selected={mode === "signup"} onClick={() => switchMode("signup")}>Sign up</button>
        </div>

        <form className={`auth-form${mode === "signup" ? " auth-form-signup" : ""}`} onSubmit={submitForm}>
          <label className="form-group">
            <span className="form-label">Username</span>
            <input className="input" name="username" autoComplete="username" autoCapitalize="none" maxLength="32" required value={form.username} onChange={updateField} placeholder={mode === "login" ? "Type your username" : "Choose a username"} />
          </label>
          <label className="form-group">
            <span className="form-label">Password</span>
            <input className="input" name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={mode === "signup" ? 8 : undefined} required value={form.password} onChange={updateField} placeholder={mode === "signup" ? "At least 8 characters" : "Your password"} />
          </label>

          {mode === "signup" && (
            <>
              <div className="auth-two-columns">
                <label className="form-group">
                  <span className="form-label">Age</span>
                  <input className="input" name="age" type="number" min="1" max="120" step="1" required value={form.age} onChange={updateField} placeholder="Your age" />
                </label>
                <label className="form-group">
                  <span className="form-label">Theme</span>
                  <select className="select" name="theme" value={form.theme} onChange={updateField}>
                    {themeOptions.map((theme) => <option key={theme.value} value={theme.value}>{theme.label}</option>)}
                  </select>
                </label>
              </div>
              <label className="form-group auth-goal-group">
                <span className="form-label">What’s your main goal?</span>
                <textarea className="input auth-goal-input" name="goals" rows="2" maxLength="240" value={form.goals} onChange={updateField} placeholder="A goal you want to work toward" />
              </label>
              <label className="form-group auth-duration-group">
                <span className="form-label">Goal duration (months)</span>
                <input className="input" name="goalDurationMonths" type="number" min={MIN_GOAL_DURATION_MONTHS} max={MAX_GOAL_DURATION_MONTHS} step="1" required value={form.goalDurationMonths} onChange={updateField} />
              </label>
              <fieldset className="auth-avatar-picker">
                <legend className="form-label">Choose your avatar</legend>
                <div className="auth-avatar-options">
                  {avatarOptions.map((avatar) => (
                    <button key={avatar.value} className={form.avatar === avatar.value ? "selected" : ""} type="button" aria-label={avatar.label} aria-pressed={form.avatar === avatar.value} onClick={() => setForm((previous) => ({ ...previous, avatar: avatar.value }))}>
                      <AvatarSvg value={avatar.value} size={38} />
                    </button>
                  ))}
                </div>
              </fieldset>
            </>
          )}

          {notice && <p className="auth-notice" role="alert">{notice}</p>}
          <button className="btn btn-primary auth-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>
        <p className="auth-mobile-quote" aria-label="Motivational quote">{quote}</p>
        <p className="auth-local-note">Your progress stays saved in this browser.</p>
      </section>
      <aside className="auth-art" aria-label="Arise productivity adventure">
        <div className="auth-art-copy">
          <span className="auth-art-kicker">ARISE · LEVEL UP YOUR DAY</span>
          <p className="auth-quote">{quote}</p>
          <span className="auth-art-orbit" aria-hidden="true">✦</span>
        </div>
      </aside>
    </main>
  );
}

export default AuthScreen;
