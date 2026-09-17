export type WaterDay = {
  title: string; wisdom: string; teaching: string; ceremony: string[];
  declaration: string; prompts: string[]; action: string; reminder: string;
  evening: string; milestone: string;
};

// Condensed, safety-edited app adaptation of Amit's supplied 21-day manuscript.
// This is not a verbatim edition or an approved scientific/clinical curriculum.
export const waterWeeks = [
  { title: 'The Clear Lake', theme: 'Purify the Vessel', law: 'Stillness reveals truth.' },
  { title: 'The Flowing River', theme: 'Charge the Water', law: 'Energy follows direction.' },
  { title: 'The Ocean', theme: 'Become the Current', law: 'Trust. Receive. Embody.' },
];
export const waterDays: WaterDay[] = [
  {
    title: 'Sacred Initiation', wisdom: 'Every river begins with a single drop.',
    teaching: 'Begin with a small commitment you can return to. Let the water be a symbol of your willingness to notice what matters and act on it. You do not need to transform your whole life today; making space for this moment is enough.',
    ceremony: ['Wash a food-safe drinking glass normally and fill it with fresh drinking water. Choose a quiet, comfortable place.', 'Hold the glass securely or rest it on the table. Breathe naturally. Imagine warm light around your hands if that image feels helpful.', 'Speak your dedication. Take a comfortable sip if you wish, noticing the simple experience of beginning.'],
    declaration: 'I dedicate this journey to my growth. I welcome what is true. Water will remind me to return to my intention.',
    prompts: ['What burdens or old identities am I ready to put down?', 'Where have I been holding back from a meaningful change?'],
    action: 'Spend up to 15 minutes gently clearing one small area of your workspace or bedroom.',
    reminder: 'I am waking up.', evening: 'Write down a thought you would like to set aside for tonight. Let an empty glass beside your journal symbolize room for rest.', milestone: 'My journey intention is set.',
  },
  {
    title: 'Water of Clarity', wisdom: 'Still water reflects what rushing water cannot.',
    teaching: 'A quieter moment can help you distinguish your own wishes from other people’s expectations. Clarity need not be absolute. Choose a direction you can explore, knowing you may refine it as you learn.',
    ceremony: ['Place a clear bowl of water on a steady surface.', 'Observe the surface or your reflection for a comfortable moment. Ask: What do I truly want? Let thoughts come without forcing an answer.', 'Write down what stood out. If you wish to drink, use a separate glass of fresh drinking water.'],
    declaration: 'I make room to hear myself clearly.',
    prompts: ['What felt true as I observed the water?', 'Which desires reflect my values, and which reflect someone else’s expectations?'],
    action: 'Write one clear intention on a card, including one part you can influence through your own actions.',
    reminder: 'Am I being honest with myself?', evening: 'Sit quietly for a few moments and reread your intention. Change any words that do not feel like yours.', milestone: 'My core vision is written.',
  },
  {
    title: 'Water of Release', wisdom: 'What dissolves no longer controls you.',
    teaching: 'A familiar belief can feel like a fact. Today, practice noticing one such belief and considering an alternative. The water is a metaphor for flexibility; changing a longstanding pattern may take repetition, support and time.',
    ceremony: ['Write one limiting belief on paper and place it beneath, never inside, your glass.', 'Imagine the belief loosening its hold while the water stays clean and separate from the ink.', 'Name a kinder, more realistic alternative. Take an optional sip, then tear the paper and put it in the bin if you want a symbolic ending.'],
    declaration: 'I can question an old story and choose a new response.',
    prompts: ['Who might I become if this belief had less influence?', 'What has this belief tried to protect me from?'],
    action: 'Try one small, safe response that differs from your usual habit. Keep necessary responsibilities and checks in place.',
    reminder: 'There is room for another thought.', evening: 'Wash your hands at a comfortable temperature and notice the sensation of finishing the day.', milestone: 'One belief has been named and questioned.',
  },
  {
    title: 'Water of Emotional Healing', wisdom: 'Water cleanses what words cannot.',
    teaching: 'Use this image as an invitation to meet feelings with gentleness. A ritual does not remove trauma or treat illness. You do not need to relive painful events, produce tears or reach a particular emotional state to take part.',
    ceremony: ['Sit somewhere comfortable with a glass on the table. Keep your eyes open if that feels better.', 'Notice your feet and breathe normally. Name only as much of your feeling as you want to meet today.', 'Offer yourself a kind sentence. Pause or stop if overwhelmed. Use fresh drinking water for any optional sip; do not collect tears or breath in it.'],
    declaration: 'My feelings can be here. I can care for myself at my own pace.',
    prompts: ['What feeling would benefit from kindness today?', 'What support would help me feel safer or less alone?'],
    action: 'Write a compassionate note to yourself. Contact a trusted support person if you want connection; reconciliation is never required.',
    reminder: 'I can meet myself gently.', evening: 'Choose a comfortable wash, shower or quiet rest. If difficult feelings persist, consider support from a qualified mental-health professional.', milestone: 'I made space for a feeling without forcing it.',
  },
  {
    title: 'Water of Gratitude', wisdom: 'What you appreciate expands.',
    teaching: 'Gratitude is a way of directing attention toward what supports you. It can coexist with grief, frustration and unmet needs. Here, speaking beside water is a reflective ritual, not a claim that words change water into medicine.',
    ceremony: ['Sit with fresh drinking water.', 'Name specific things you appreciate. Try up to 21, or choose three if that is more natural today.', 'Notice any feeling that arises, including neutrality. Take an optional sip as a pause between thoughts.'],
    declaration: 'I notice what supports me, without denying what is difficult.',
    prompts: ['What three everyday supports do I often overlook?', 'How could I express appreciation in a challenging relationship while keeping my boundaries?'],
    action: 'Give someone a specific, sincere thank-you, without expecting a response.',
    reminder: 'Thank you.', evening: 'Record one moment you appreciated today.', milestone: 'Specific gratitude has been expressed.',
  },
  {
    title: 'Water of Forgiveness', wisdom: 'Softness transforms what force cannot.',
    teaching: 'Forgiveness is personal and optional. It does not excuse harm, require contact or replace boundaries and accountability. Today’s practice can simply mean setting down a little of the effort of carrying a painful story.',
    ceremony: ['Hold a glass securely or place it beside you.', 'Choose a manageable situation, or focus on offering compassion to yourself. There is no need to picture someone who makes you feel unsafe.', 'Imagine some space around the feeling. Say the words only if they fit, and take an optional sip.'],
    declaration: 'I can care for my peace and keep the boundaries I need.',
    prompts: ['What part of this experience still needs care or protection?', 'What might self-forgiveness look like without dismissing responsibility?'],
    action: 'Write an unsent letter. Keep it privately or tear it into a bin; there is no need to burn or flush it.',
    reminder: 'Softness and boundaries can coexist.', evening: 'Wash your face comfortably, then offer yourself one kind sentence.', milestone: 'I chose one act of self-compassion.',
  },
  {
    title: 'Sacred Purification Ceremony', wisdom: 'An empty vessel is ready to receive.',
    teaching: 'Review your first week without demanding a complete reset. Some patterns may have softened; others may still need attention. The clear lake symbolizes space to notice, rather than proof that all pain or fear has disappeared.',
    ceremony: ['Prepare a bowl of plain water for a symbolic offering, separate from drinking water.', 'Breathe normally and name something you want to carry more lightly. Imagine making room for a useful next step.', 'Pour the plain water onto suitable soil or down a sink. Let the action mark a transition; you do not need to drink it.'],
    declaration: 'I acknowledge what I have learned and make room for what comes next.',
    prompts: ['How do I feel compared with Day 1?', 'What helped me this week, and what still needs support?'],
    action: 'Choose a manageable screen-free interval while keeping essential communication available.',
    reminder: 'There is space to begin again.', evening: 'Review your week and choose one practice to carry forward.', milestone: 'Week 1 reflection is complete.',
  },
  {
    title: 'Water of Intention', wisdom: 'Direction creates movement.',
    teaching: 'A river offers a useful image for purposeful action. Give your intention a direction by naming what matters and what you can do next. A statement can guide attention and choices; it cannot guarantee an external result.',
    ceremony: ['Write your intention on a card and place your glass beside or over it, keeping paper out of the water.', 'Read the statement slowly. Imagine one ordinary action that would support it.', 'Hold the glass comfortably, say your intention and take an optional sip.'],
    declaration: 'I choose a direction and take the next useful step.',
    prompts: ['What action would support my intention today?', 'What hesitation needs practical attention or support?'],
    action: 'Take one modest, purposeful step: draft a message, research an option or schedule focused time.',
    reminder: 'My next step matters.', evening: 'Note what you did and what you learned, even if the result was unexpected.', milestone: 'An intention has become an action.',
  },
  {
    title: 'Water of Affirmation', wisdom: 'Words shape inner landscapes.',
    teaching: 'The words you repeat can influence how you approach a situation. Choose language that is encouraging and believable. Speaking beside water is a cue for reflection, not a process that binds sound to DNA or rewrites biology.',
    ceremony: ['Prepare three supportive statements, such as: I can learn; I can ask for help; I can take one step.', 'Speak each slowly beside your glass in a normal voice. Notice which words fit and which need adjusting.', 'Take an optional sip and choose one statement to use during a real task.'],
    declaration: 'I can speak to myself with honesty and encouragement.',
    prompts: ['Which statement felt helpful, and which felt forced?', 'How can I acknowledge difficulty without turning it into a judgment of myself?'],
    action: 'Notice one self-critical sentence and rewrite it in a kinder, realistic way. You do not need to suppress complaints or difficult feelings.',
    reminder: 'I am learning how to support myself.', evening: 'Repeat a phrase that feels steady: I can rest; I can begin again.', milestone: 'Three supportive statements are chosen.',
  },
  {
    title: 'Future Self Water', wisdom: 'The future is already flowing toward you.',
    teaching: 'Imagine a future version of yourself as a creative exercise. This is a way to explore values and possibilities, not evidence of a separate timeline. Focus on the habits and relationships that would make that life meaningful.',
    ceremony: ['Sit comfortably with water on a stable surface and breathe naturally.', 'Imagine yourself three years from now. Notice an ordinary day, your priorities and how you treat yourself.', 'Picture that imagined self offering encouragement. Open your eyes and take an optional sip.'],
    declaration: 'I can practice one quality of the person I hope to become.',
    prompts: ['What advice would my imagined future self offer?', 'Which habit or quality can I practice today?'],
    action: 'Choose one affordable, realistic behavior that reflects your values, such as preparing carefully or keeping a promise.',
    reminder: 'What choice would support the person I am becoming?', evening: 'Write a question you would like to consider tomorrow, then allow yourself to rest.', milestone: 'One future-self quality has been practiced.',
  },
  {
    title: 'Opportunity Water', wisdom: 'Abundance often arrives disguised as opportunity.',
    teaching: 'Curiosity can help you notice possibilities you previously overlooked. Possibilities still need evaluation: a coincidence is not proof that an offer is safe or right for you. Pair openness with questions, evidence and boundaries.',
    ceremony: ['Sit near a window with your glass.', 'Name a few possible routes toward your goal, including ones you have not explored.', 'Imagine widening your attention. Say your declaration and take an optional sip.'],
    declaration: 'I am open to possibilities and thoughtful about my choices.',
    prompts: ['What possibility have I overlooked?', 'What information would help me evaluate it?'],
    action: 'Make one or two respectful connections or research a useful opportunity, without pressure to buy or commit.',
    reminder: 'I can be curious.', evening: 'Record opportunities you noticed and a practical next step for any worth exploring.', milestone: 'A possibility has been noticed and considered.',
  },
  {
    title: 'Worthiness Water', wisdom: 'The river never questions whether it deserves to flow.',
    teaching: 'Your worth is not something you must earn through achievement. Let this practice support dignity and self-respect. Wanting more can coexist with gratitude, realistic limits and respect for other people.',
    ceremony: ['Stand or sit comfortably with your glass. A mirror is optional.', 'Meet your reflection gently, or look at the glass if eye contact feels uncomfortable.', 'Speak words of self-respect and take an optional sip.'],
    declaration: 'I deserve care and respect. I can ask for what I need.',
    prompts: ['Where would a clearer boundary support me?', 'What old message about worth am I ready to question?'],
    action: 'Set one thoughtful boundary or ask for time to consider a request.',
    reminder: 'My needs matter too.', evening: 'Notice one way you treated yourself with respect today.', milestone: 'One boundary or need has been acknowledged.',
  },
  {
    title: 'Prosperity Water', wisdom: 'Water naturally seeks expansion.',
    teaching: 'Use the image of flowing water to reflect on your relationship with resources. Financial circumstances are real and cannot be reduced to mindset. A useful prosperity practice combines values, planning, skills and decisions within your means.',
    ceremony: ['Write a realistic resource goal on a card next to your glass.', 'Imagine the feeling of steadiness you hope this goal will support. Notice one practical habit that could help.', 'Speak your declaration and take an optional sip.'],
    declaration: 'I can care for my resources and make thoughtful choices.',
    prompts: ['What feelings arise when I think about money?', 'What would greater financial steadiness make possible?'],
    action: 'Choose a no-cost step: review a budget, learn a skill or identify an avoidable expense. Spending or investing is not required to prove abundance.',
    reminder: 'I can act with care and perspective.', evening: 'Record one resource you appreciate and one practical next step.', milestone: 'One grounded resource action is chosen.',
  },
  {
    title: 'Sacred Charging Ceremony', wisdom: 'Intention plus emotion creates momentum.',
    teaching: 'Bring together the intentions, supportive language and actions of Week 2. Here, charging means renewing attention and commitment. You do not need emotional intensity, certainty or a major decision to mark your progress.',
    ceremony: ['Place your water on a clear surface. Use soft lighting if you wish.', 'Breathe naturally. Recall gratitude, read your intention and choose one supportive statement.', 'Imagine your next practical step. Say your declaration and take an optional sip at your usual pace.'],
    declaration: 'I renew my intention and commit to a thoughtful next step.',
    prompts: ['What has changed in my focus over two weeks?', 'What support or preparation would help me continue?'],
    action: 'Make a small, reversible commitment such as scheduling practice or sharing a draft. Do not sign contracts or make investments to demonstrate belief.',
    reminder: 'Consistency matters more than intensity.', evening: 'Rest with gentle music or quiet, at a comfortable volume.', milestone: 'Week 2 has been reviewed and the next step chosen.',
  },
  {
    title: 'Receiving Water', wisdom: 'The ocean receives every river.',
    teaching: 'Receiving can mean allowing appropriate help, appreciation or connection. Openness does not require giving up choice. You can welcome what supports you and decline what does not.',
    ceremony: ['Sit with support and hold the glass securely, or leave it on the table.', 'Relax your shoulders as comfortable. Think of support you would be willing to receive.', 'Say your declaration and take a comfortable, optional sip.'],
    declaration: 'I can accept support while keeping my freedom to choose.',
    prompts: ['When is it difficult for me to accept help?', 'What kind of support would feel welcome?'],
    action: 'If someone offers a safe, welcome kindness, practice a simple thank-you. You remain free to decline any offer.',
    reminder: 'Receiving and discernment belong together.', evening: 'Record a moment of support, including support you gave yourself.', milestone: 'A helpful form of support has been recognized.',
  },
  {
    title: 'Courage Water', wisdom: 'Water moves around obstacles rather than stopping.',
    teaching: 'Courage can be quiet and gradual. Fear may contain useful information as well as uncertainty. Choose a manageable step toward something meaningful while respecting safety, preparation and your own pace.',
    ceremony: ['Identify one task you have avoided and divide it into a small first step.', 'Recall a time you handled something difficult. Hold your glass and notice what supported you then.', 'Say your declaration and take an optional sip before deciding whether to try your chosen step.'],
    declaration: 'I can feel uncertainty and take a careful step.',
    prompts: ['What am I afraid of, and what preparation would help?', 'What is the smallest useful action I can take?'],
    action: 'Try that small step if it is safe and appropriate. Preparing, asking for help or rescheduling thoughtfully also counts.',
    reminder: 'I can move at a workable pace.', evening: 'Acknowledge effort rather than measuring success by fearlessness.', milestone: 'A manageable courageous step has been considered or taken.',
  },
  {
    title: 'Abundance Immersion', wisdom: 'The ocean never fears running out.',
    teaching: 'Use the ocean as a symbol of connection and generosity, while remembering that real resources have limits. Generosity can mean time, attention or kindness. You do not need to give away money or essentials to belong to this practice.',
    ceremony: ['Prepare a bowl of plain, comfortably cool water. Do not add essential oils.', 'If comfortable for your skin, rest your hands in the water briefly; observing is equally welcome.', 'Notice the sensation or appearance of the water, say your declaration, then dry your hands. Keep this bowl separate from drinking water.'],
    declaration: 'I notice what I have and share within my capacity.',
    prompts: ['Where do I already experience enough?', 'What could I share without neglecting my needs?'],
    action: 'Offer a small act of kindness, useful knowledge or attention within your capacity.',
    reminder: 'There are many ways to be generous.', evening: 'Name one thing that felt nourishing today.', milestone: 'Generosity has been practiced within healthy limits.',
  },
  {
    title: 'Trust Water Meditation', wisdom: 'The river never worries about reaching the sea.',
    teaching: 'Some parts of a goal are within your control and others are not. Trust can mean continuing useful effort while allowing uncertainty. Rest is compatible with responsibility; you do not need to assume that every event is destined or perfect.',
    ceremony: ['Place your glass on a stable surface and sit comfortably.', 'Observe the water for a few moments, returning to normal breathing whenever your mind wanders.', 'Name one thing you can influence and one you cannot. Say your declaration and take an optional sip.'],
    declaration: 'I can act where I have influence and allow space for uncertainty.',
    prompts: ['What am I trying to control that is beyond me?', 'What would make the present moment more nourishing?'],
    action: 'Take a manageable break for a low-pressure activity while keeping essential responsibilities in view.',
    reminder: 'I can pause without giving up.', evening: 'Spend a quiet moment noticing your surroundings and letting the day end.', milestone: 'A pause and a boundary of control have been recognized.',
  },
  {
    title: 'Timeline Water Journey', wisdom: 'Every drop contributes to the ocean.',
    teaching: 'Imagine your future at different distances to connect today’s choices with longer-term values. These are possibilities, not predictions. Leave room to change your plans as circumstances and priorities evolve.',
    ceremony: ['Place three cards on the table: 6 Months, 1 Year and 3 Years. One glass of water is enough.', 'Look at each card in turn and imagine an ordinary moment of a life you would value. Note a practical step for each horizon.', 'Take one optional sip when finished. There is no need to drink three glasses or any fixed amount.'],
    declaration: 'I can hold a long view and begin with today.',
    prompts: ['How does my six-month vision differ from my three-year vision?', 'Which worry might look different with more perspective?'],
    action: 'Write a future-self journal entry describing a meaningful ordinary day, then identify one habit that supports it.',
    reminder: 'Small actions can support a longer vision.', evening: 'Choose one next step to revisit tomorrow and set the rest aside for tonight.', milestone: 'Three future horizons have been explored.',
  },
  {
    title: 'Commitment Water Ceremony', wisdom: 'Consistency creates rivers.',
    teaching: 'A sustainable commitment includes flexibility. Missing a day does not erase what you have learned. Choose a practice that fits your life and a compassionate way to return when circumstances change.',
    ceremony: ['Write a short commitment with a realistic frequency and duration.', 'Read it beside your glass. Include permission to rest, adapt or seek support.', 'Sign and date it if you wish, say your declaration and take an optional sip.'],
    declaration: 'I choose a practice I can sustain, and I can begin again when needed.',
    prompts: ['Which habit do I genuinely want to continue?', 'What boundaries and supports would help me return to it?'],
    action: 'Choose a simple place and time for practice using items you already own.',
    reminder: 'I return with kindness.', evening: 'Place your commitment somewhere you can revisit it tomorrow.', milestone: 'A flexible, sustainable commitment is written.',
  },
  {
    title: 'Grand Water Manifestation Ceremony', wisdom: 'You are both the drop and the ocean.',
    teaching: 'Mark the end of these 21 days by recognizing your attention, effort and learning. You do not need a dramatic breakthrough to honor the journey. Carry forward what helps, revise what does not, and connect your vision to practical action.',
    ceremony: ['Hold your glass and recall your intention and a few specific gratitudes.', 'Offer kindness to what remains difficult. Imagine one quality of your future self you want to practice.', 'Speak the closing declaration, take an optional sip and write a realistic next chapter.'],
    declaration: 'Like water, I flow. Like water, I trust. Like water, I receive. Like water, I create. Like water, I become.',
    prompts: ['What have I learned, including what did not change?', 'What meaningful and realistic priorities will guide my next 90 days?'],
    action: 'Create a 90-day plan with up to three priorities, weekly actions and review dates. Keep hydration ordinary; no programmed drinking schedule is required.',
    reminder: 'I can return to awareness and action.', evening: 'Celebrate your effort in a way that feels right, and choose when to review your plan.', milestone: 'The 21-day reflection journey and next-step plan are complete.',
  },
];

export const waterPrefix = (day: number) => `water-course:v2:${day}:`;
export function nextWaterDay(answers: Record<string, string>): number | null {
  const index = waterDays.findIndex((_, i) => answers[waterPrefix(i) + 'completed'] !== '1');
  return index < 0 ? null : index;
}
export function waterAnswers(answers: Record<string, string>, day: number, values: Record<string, string>, completed: boolean) {
  const next = { ...answers };
  const prefix = waterPrefix(day);
  for (const [key, value] of Object.entries(values)) next[prefix + key] = value;
  next[prefix + 'saved'] = '1';
  next[prefix + 'completed'] = completed ? '1' : '0';
  return next;
}
