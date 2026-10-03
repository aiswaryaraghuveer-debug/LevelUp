import React, { useState } from "react";

const DAILY_QUOTE_STORAGE_KEY = "arise-daily-motivation";
const motivationQuotes = [
  "Small wins are how impossible things begin.",
  "Your next level starts with the next choice.",
  "Consistency turns effort into momentum.",
  "Do the next right thing, then do it again.",
  "Progress does not need applause to count.",
  "You can start small and still aim high.",
  "Every finished task is proof you can trust yourself.",
  "The future you want is built by what you do today.",
  "Keep moving. Clarity often catches up.",
  "Showing up is a win before the work even begins.",
];

function getTodayKey(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function getDailyQuote() {
  const today = getTodayKey(new Date());

  try {
    const savedQuote = JSON.parse(window.localStorage.getItem(DAILY_QUOTE_STORAGE_KEY));
    if (savedQuote?.date === today && motivationQuotes.includes(savedQuote.quote)) {
      return savedQuote.quote;
    }

    const quote = motivationQuotes[Math.floor(Math.random() * motivationQuotes.length)];
    window.localStorage.setItem(DAILY_QUOTE_STORAGE_KEY, JSON.stringify({ date: today, quote }));
    return quote;
  } catch {
    return motivationQuotes[Math.floor(Math.random() * motivationQuotes.length)];
  }
}

function MotivationCard() {
  const [quote] = useState(getDailyQuote);

  return (
    <section className="card motivation-card" aria-labelledby="daily-motivation-title">
      <blockquote>{quote}</blockquote>
    </section>
  );
}

export default MotivationCard;