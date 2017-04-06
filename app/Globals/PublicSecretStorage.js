let fallInLove = [
  "Q1: Given the choice of anyone in the world, who would you want as a dinner guest?",
  "Q2: Would you like to be famous? In what way?",
  "Q3: Before making a telephone call, do you ever rehearse what you are going to say? Why?",
  "Q4: What would be a 'perfect' day for you?",
  "Q5: When did you last sing to yourself? To someone else?",
  "Q6: If you were able to live to the age of 90 and retain either the mind or body of a 30-year-old for the last 60 years of your life, which would you want?",
  "Q7: Do you have a secret hunch about how you will die?",
  "Q8: What are three things you think I have in common with you?",
  "Q9: For what in your life do you feel most grateful?",
  "Q10: If you could change anything about the way you were raised, what would it be?",
  "Q11: (In person) Take four minutes and tell your partner your life story in as much detail as possible.",
  "Q12: If you could wake up tomorrow having gained any quality or ability, what would it be?",
  "Q13: If a crystal ball could tell you the truth about yourself, your life, the future or anything else, what would you want to know?",
  "Q14: Is there something that you’ve dreamed of doing for a long time? Why haven’t you done it?",
  "Q15: What is the greatest accomplishment of your life?",
  "Q16: What do you value most in a friendship?",
  "Q17: What is your most treasured memory?",
  "Q18: What is your most terrible memory?",
  "Q19: If you knew that in one year you would die suddenly, would you change anything about the way you are now living? Why?",
  "Q20: What does friendship mean to you?",
  "Q21: What roles do love and affection play in your life?",
  "Q22: What do you think are five positive things about me?",
  "Q23: How close and warm is your family? Do you feel your childhood was happier than most other people’s?",
  "Q24: How do you feel about your relationship with your mother?",
  "Q25: Make three true 'we' about us each. For instance, 'We both were born in September...'",
  "Q26: Complete this sentence: 'I wish I had someone who I could share ___ with'",
  "Q27: If you were going to become close friends with me, what would be important for me to know?",
  "Q28: What's something you liked about me when we first met?",
  "Q29: What was the most embarassing moment in your life?",
  "Q30: When did you last cry in front of another person? By yourself?",
  "Q31: What's something you like about me but have been afraid to say or haven't said until now?",
  "Q32: What, if anything, is too serious to be joked about?",
  "Q33: If you were to die this evening with no opportunity to communicate with anyone, what would you most regret not having told someone? Why haven’t you told them yet?",
  "Q34: Your house, containing everything you own, catches fire. After saving your loved ones and pets, you have time to save one last item. What would it be? Why?",
  "Q35: Of all the people in your family, whose death would you find most disturbing? Why?",
  "Q36: (In person) Share a personal problem and ask your partner’s advice on how they might handle it. Also, ask your partner to reflect back to you how you seem to be feeling about the problem.",
  "Q37: (In person) Look into your partner's eyes for four minutes. Do the whole four minutes even though it feels weird! This final step is very important."
];

//this._pushToPublicSecrets("Fall in Love", fallInLove);

_pushToPublicSecrets(category, secretsArray) {
  var voteData = {}
  voteData[this.props.userId] = 'upvote';
  secretsArray.forEach((item, index) => {
    let secretData = {text: item, category: category, score: 1, votes: voteData, '.priority': -1};
    this.publicSecrets.child(category).push(secretData)
  });
}
