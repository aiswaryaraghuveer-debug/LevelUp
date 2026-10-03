import React, { useState } from "react";

const DAILY_QUOTE_STORAGE_KEY = "arise-daily-motivation";
const motivationQuotes = `
1. Believe you can, then prove it.
2. Your future is created by what you do today.
3. Start where you are. Use what you have. Do what you can.
4. Small steps still move you forward.
5. You are capable of more than you think.
6. Dream big. Start small. Keep going.
7. Progress begins the moment you refuse to quit.
8. Your mindset shapes your reality.
9. Make yourself proud.
10. Every day is another chance to become better.
11. Don't wait for motivation. Create momentum.
12. Your limits are often only beliefs.
13. Keep moving, even when the path is unclear.
14. One day or day one. You decide.
15. Difficult roads often lead to meaningful destinations.
16. Become the person your future self will thank.
17. Your effort today becomes your strength tomorrow.
18. Keep believing in the possibility of better.
19. You don't need to be perfect to make progress.
20. Start before you're ready.
21. Growth begins outside your comfort zone.
22. Your story is still being written.
23. Don't let fear make your decisions.
24. The hardest step is often the first.
25. Keep going. You're closer than you think.
26. Make progress louder than your excuses.
27. Your potential has no expiration date.
28. Focus on what you can control.
29. Turn your obstacles into opportunities.
30. You were made to grow, not stay comfortable.
31. Every setback can teach you something.
32. Keep showing up for yourself.
33. Believe in the work you're putting in.
34. Your attitude can change your entire day.
35. Great things take time.
36. Don't stop because it's hard.
37. Your next chapter can be better than your last.
38. Choose courage over comfort.
39. You don't need permission to pursue your dreams.
40. Keep your eyes on the goal and your feet on the ground.
41. Discipline will take you where motivation cannot.
42. Do it even when you don't feel like it.
43. Consistency beats intensity when intensity doesn't last.
44. Hard work compounds.
45. Show up. Work hard. Repeat.
46. Success is built in ordinary moments.
47. Do the work nobody sees.
48. Your habits create your future.
49. Discipline is choosing what you want most over what you want now.
50. Stay consistent when nobody is watching.
51. Effort never goes completely wasted.
52. Work quietly and let your results speak.
53. Keep your promises to yourself.
54. Success starts with doing the boring things consistently.
55. Don't count the days. Make the days count.
56. The work you avoid is often the work you need most.
57. Excellence is built one repetition at a time.
58. Keep practicing until difficult becomes natural.
59. Consistency turns dreams into reality.
60. Don't wish for it. Work for it.
61. Your daily choices shape your destiny.
62. Discipline creates freedom.
63. The grind is temporary. The growth stays.
64. Make today productive, not perfect.
65. Do something today your future self will appreciate.
66. Keep working when progress feels invisible.
67. Success rewards persistence.
68. Your routine determines your results.
69. Master the basics, then build greatness.
70. The difference between trying and achieving is often persistence.
71. Success begins with a decision to try.
72. Think bigger than your current circumstances.
73. Chase progress, not applause.
74. Let your ambition be stronger than your fear.
75. Build the life you keep imagining.
76. Success is a journey of becoming.
77. Don't compete with others. Compete with yesterday's you.
78. Your goals deserve your attention.
79. Make your vision stronger than your excuses.
80. Success starts when excuses end.
81. Aim high, work smart, stay humble.
82. Your dreams need action, not just intention.
83. Turn your ideas into action.
84. The goal is not to be better than everyone. It's to become better than you were.
85. Think it. Plan it. Build it.
86. Don't wait for opportunities. Prepare for them.
87. Big achievements begin with small decisions.
88. Your ambition is your invitation to grow.
89. Keep building until your dream becomes your normal.
90. Success is earned through repeated effort.
91. Make your vision bigger than your fear.
92. You don't need luck when you're prepared.
93. Be patient with the process and relentless with the effort.
94. Success belongs to those who keep moving.
95. Let your goals give you direction.
96. Build something you're proud of.
97. The best investment is becoming better.
98. Your dream is worth the effort.
99. Keep your standards high and your excuses low.
100. Become undeniable through your work.
101. Every mistake is a lesson in disguise.
102. Growth requires discomfort.
103. Learn, adapt, improve, repeat.
104. You don't fail when you learn.
105. Be a student of your own journey.
106. Every challenge can make you stronger.
107. Don't fear mistakes. Fear refusing to learn from them.
108. Growth happens one lesson at a time.
109. Stay curious.
110. The person you become matters as much as the goal you reach.
111. Knowledge grows when you use it.
112. Keep learning, even when you're good.
113. Your mistakes don't define you. Your response does.
114. Improvement begins with honesty.
115. Be willing to start as a beginner.
116. Every expert was once learning the basics.
117. Let every experience make you wiser.
118. Challenge yourself to become better.
119. Growth is rarely comfortable.
120. Learn from yesterday without living in it.
121. The best lessons often come from difficult seasons.
122. Progress requires patience.
123. Keep asking questions.
124. Never stop becoming.
125. Your future depends on what you learn today.
126. Turn curiosity into capability.
127. Learn something that your future self can use.
128. Improvement is a lifelong process.
129. Mistakes are evidence that you're trying.
130. Become stronger through what you go through.
131. Trust yourself enough to begin.
132. You are more capable than your doubts suggest.
133. Stop underestimating yourself.
134. Confidence grows through action.
135. Believe in yourself before others do.
136. You don't need everyone's approval.
137. Know your worth and keep growing.
138. Your voice matters.
139. You are allowed to take up space.
140. Be proud of how far you've come.
141. Don't compare your beginning to someone else's middle.
142. Your uniqueness is your strength.
143. You don't have to prove yourself to everyone.
144. Walk into every room knowing you belong there.
145. Trust the person you're becoming.
146. Your potential is bigger than your fear.
147. Confidence is built, not found.
148. Give yourself credit for surviving difficult days.
149. You can handle more than you realize.
150. Believe in your ability to figure things out.
151. Stop waiting to feel confident. Start acting confidently.
152. You don't need to have everything figured out.
153. Your journey is yours.
154. Be your own biggest supporter.
155. Don't shrink yourself to make others comfortable.
156. You are enough while still having room to grow.
157. Your past does not control your future.
158. Stand tall, even when life feels heavy.
159. You have overcome things you once thought you couldn't.
160. Trust your ability to keep moving forward.
161. Life changes when you change your choices.
162. Storms don't last forever.
163. Keep going through the difficult days.
164. Tough times can reveal your strength.
165. You can begin again at any moment.
166. A bad day is not a bad life.
167. There is always another chapter.
168. Don't let one failure define your journey.
169. Keep hope alive.
170. Sometimes the slowest progress is still progress.
171. Give yourself time to grow.
172. Better days can be built, not just waited for.
173. Keep walking, even if you have to walk slowly.
174. You survived yesterday. You can face today.
175. Every sunrise is another opportunity.
176. Let go of what you cannot change.
177. Focus on the next step, not the entire staircase.
178. You are stronger than the moment you're facing.
179. Difficult seasons eventually change.
180. Don't give up during the chapter you wouldn't want to end on.
181. Your comeback can begin today.
182. Keep choosing hope.
183. Healing and growth take time.
184. There is strength in starting over.
185. Your circumstances can change.
186. Keep moving toward the life you want.
187. You haven't seen all the good things waiting for you.
188. Give tomorrow a chance.
189. Sometimes starting again is the bravest thing you can do.
190. Your journey doesn't have to look like anyone else's.
191. Keep going.
192. Start now.
193. Stay hungry.
194. Never settle.
195. Trust the process.
196. Choose courage.
197. Make it happen.
198. Keep becoming.
199. Rise again.
200. Your time is coming.
`.trim().split(/\r?\n/).map((quote) => quote.replace(/^\d+\.\s*/, ""));

export function getRandomMotivationalQuote(excludedQuote) {
  const choices = excludedQuote
    ? motivationQuotes.filter((quote) => quote !== excludedQuote)
    : motivationQuotes;
  return choices[Math.floor(Math.random() * choices.length)];
}

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

    const quote = getRandomMotivationalQuote();
    window.localStorage.setItem(DAILY_QUOTE_STORAGE_KEY, JSON.stringify({ date: today, quote }));
    return quote;
  } catch {
    return getRandomMotivationalQuote();
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