/** New development content following the agreed seven-part journey.
 * Not a replacement for Amit's approved Manifesting Through Water™ scripts. */
export const foundationDays = [
  {
    title: 'Vision', minutes: 8,
    teaching: 'Begin with what matters to you, rather than what you feel you should want. An intention gives your attention a direction; it does not promise control over life. Choose something meaningful enough to return to, and small enough to begin living today.',
    practice: ['Feel the support beneath you. Let your breathing stay natural.', 'Name one area of your life that needs attention. You do not need to solve every area today.', 'Describe what you want to move towards in a sentence. Include something you can influence through your choices.'],
    affirmation: 'I can choose a meaningful direction and begin where I am.',
    prompt: 'What am I ready to create, and what would it look like in everyday life?',
    action: 'Make one small space for this intention: reserve ten minutes, clear a work surface, or write down your first step.',
    evening: 'Where did I give this intention attention today?'
  },
  {
    title: 'Why', minutes: 8,
    teaching: 'A goal may describe what you want, while your reason reveals what you value. Look beneath recognition, money or achievement without judging those desires. Perhaps you are seeking freedom, connection, contribution or steadiness. Let that value help shape the way you pursue the goal.',
    practice: ['Read your intention slowly.', 'Ask what this would make possible. Write the first honest answer, not the most impressive one.', 'Name a value beneath that answer, and notice one way it already exists in your life.'],
    affirmation: 'I can move towards what I value without proving my worth.',
    prompt: 'Why does this matter to me, beyond other people’s expectations?',
    action: 'Express the underlying value once today, even before the goal is achieved.',
    evening: 'Did my choices reflect what I value? What would I adjust?'
  },
  {
    title: 'Feel', minutes: 8,
    teaching: 'You do not have to feel positive all the time to move forward. Doubt, disappointment and hope can exist together. Meet the feeling that is here, then consider what would help you take a kind and useful next step.',
    practice: ['Keep your eyes open or closed, whichever is more comfortable.', 'Notice one feeling without asking it to change. If this becomes uncomfortable, pause and look around the room.', 'Choose a quality you want to practise today: patience, courage, steadiness or curiosity.'],
    affirmation: 'My feelings are welcome; my next step can still be gentle and purposeful.',
    prompt: 'What do I feel now, and what quality would support me today?',
    action: 'Choose one action that expresses that quality without forcing a different mood.',
    evening: 'What helped me respond to myself with more kindness?'
  },
  {
    title: 'See', minutes: 10,
    teaching: 'Visualization is a way to rehearse attention and behaviour, not a guarantee of an outcome. Picture an ordinary moment of living your intention. Include the process: preparation, effort, asking for help and responding to setbacks. If mental pictures do not come easily, use words instead.',
    practice: ['Choose an everyday scene connected to your intention.', 'Imagine or describe what you are doing, where you are, and how you respond to another person.', 'Include one realistic obstacle. Rehearse a calm next step rather than a perfect outcome.'],
    affirmation: 'I can practise the choices that support the life I want.',
    prompt: 'What ordinary scene can I rehearse, and what behaviour makes it possible?',
    action: 'Practise one behaviour from your scene in real life today.',
    evening: 'What did practice teach me that imagination alone could not?'
  },
  {
    title: 'Align', minutes: 10,
    teaching: 'A belief can feel familiar without being the whole truth. Notice one assumption that makes your intention harder to approach. You do not need to replace it with a statement you cannot believe. Look for a balanced alternative that leaves room for learning and real-world constraints.',
    practice: ['Write one thought that appears when you consider your goal.', 'Separate what you know from what you predict. Consider evidence for and against the prediction.', 'Write a more balanced sentence, such as “I do not know yet, but I can learn one part.”'],
    affirmation: 'I can question an old assumption and make room for learning.',
    prompt: 'What belief needs attention, and what more balanced belief can I practise?',
    action: 'Take a small, low-risk step that tests your new perspective.',
    evening: 'What evidence did I notice, including anything that surprised me?'
  },
  {
    title: 'Act', minutes: 8,
    teaching: 'Intention becomes useful when it meets action. Choose a step within your control rather than an outcome that depends on someone else. Make it specific enough to know when you have done it. A small completed action can teach you more than a large perfect plan.',
    practice: ['List three possible steps towards your intention.', 'Choose the smallest useful one that fits your available time and resources.', 'Decide when and where you will do it. Name a smaller fallback if the day changes.'],
    affirmation: 'One practical step is enough to begin moving.',
    prompt: 'What will I do, when will I do it, and what is my smaller fallback?',
    action: 'Do your chosen step. If it cannot happen, record the obstacle and reschedule without self-blame.',
    evening: 'What did I do or learn, and what support would help next?'
  },
  {
    title: 'Notice', minutes: 10,
    teaching: 'Reflection closes the loop between intention and experience. Notice effort, changes, difficulties and opportunities without turning every event into a sign. A result that has not arrived is not evidence that you failed to believe enough. Use what you learned to choose your next week.',
    practice: ['Read your earlier reflections, if you wish.', 'Name one action, one learning and one thing you appreciate. Include what remains difficult.', 'Choose whether to continue, refine or release this intention. Any of these can be an honest next step.'],
    affirmation: 'I can appreciate my effort, learn from reality and choose again.',
    prompt: 'What changed this week, and what will I carry into the next one?',
    action: 'Plan one manageable practice for the coming week, with space for rest and support.',
    evening: 'What am I grateful for, and what am I ready to approach differently?'
  },
] as const;

export function nextFoundationDay(completed: readonly number[]) {
  const next = foundationDays.findIndex((_, index) => !completed.includes(index));
  return next < 0 ? null : next;
}
