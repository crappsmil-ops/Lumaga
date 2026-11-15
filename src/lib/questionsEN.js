
/*
 * LUMAGA – ENGLISH QUESTION CATALOG
 *
 * 484 cards:
 * - General: 40
 * - Wild: 239
 * - Chaos: 205
 *
 * IMPORTANT:
 * Keep the technical keys "hot", "hotmild" and "hardcore".
 * Only the visible game-mode names are Wild and Chaos.
 */

const cardsEN = (raw, category, type) =>
  raw.trim().split("\n").map((line) => ({
    text: line.trim(),
    ...(category !== null ? { category } : {}),
    ...(type ? { type } : {}),
  }));

// ============================================================
// GENERAL – WARM-UP, SPICY, ACTIONS
// ============================================================

export const questionsEN = [
  ...cardsEN(`
What's your guilty pleasure song that you secretly dance to?
What was your most embarrassing moment at a party?
Have you ever kissed someone you didn't actually like?
What's the craziest thing you've ever done while drunk?
Who in this group do you find the most attractive?
Have you ever stalked someone on social media?
What was your worst dating fail?
Have you ever lied to impress someone?
What's the last dream you remember?
Have you ever sent a message to the wrong person?
What's the most embarrassing song on your playlist?
Who was your most recent crush?
What's the dumbest excuse you've ever used?
What's the most embarrassing username you've ever had?
Have you ever pretended not to notice someone?
What's the most childish thing you still do?
What secret have you accidentally let slip?
`, 1),

  ...cardsEN(`
What's your biggest weakness in a relationship?
Have you ever messaged someone else while you were in a relationship?
Which ex would you date again, and why?
What secretly makes you fall for someone (e.g., their laugh, voice, or humor)?
Have you ever ghosted someone? Why?
What's the craziest place you've ever made out with someone?
What's the bravest thing you've ever done in a relationship?
What's your biggest relationship red flag?
What was your most intense date?
What would you do if your ex walked in right now?
What's the most flattering thing you've ever received?
Who here would be more of a good friend than a date for you, and why?
What's your biggest turn-off?
`, 2),

  ...cardsEN(`
Do 10 push-ups!
Imitate someone in this group – everyone has to guess who!
Show off your best dance move – everyone's watching!
Draw an invisible masterpiece on another player's hand with your finger.
Sing a song of your choice for 30 seconds!
Tell an improvised story in one minute using the words: kiss, night, secret!
Whisper something nice into the ear of the person to your right!
Do the silliest dance you know!
Speak with an unfamiliar accent for 30 seconds!
Let the group choose your next drink!
`, "action", "action"),
];

// ============================================================
// WILD – ACTIONS AND QUESTIONS
// ============================================================

export const hotQuestionsEN = [
  // Wild – Mild: Actions

  ...cardsEN(`
Kiss someone of your choice on the cheek!
Whisper a pickup line into the ear of the person to your right!
Give the person to your left a one-minute shoulder massage!
Swap seats with the most attractive person here!
Show off your most movie-worthy dance pose!
Give the person next to you three genuine compliments!
Gently stroke the hair of the person next to you!
Hold hands with the person next to you for two rounds!
Kiss the person to your right on the forehead!
Whisper your biggest secret to the person to your left!
Gently stroke the cheek of the person opposite you!
Tell the most attractive person here what you like about them!
Give the person to your left a one-minute neck massage!
Sit back-to-back with the person to your right for one minute!
Describe the perfect kiss for the person opposite you!
Take a model-style selfie with someone of your choice!
Compliment the person next to you on their style!
Kiss the hand of the person to your right!
Whisper to the most attractive person here what you first noticed about them!
Gently stroke the arm of the person to your left!
Tell the person opposite you what you like best about their presence!
Kiss the person to your right on the shoulder!
Hold eye contact with the most attractive person here for 30 seconds!
Describe your perfect first kiss to the person next to you!
Sit close to the most attractive person here!
Whisper to the person to your left what instantly makes you fall for someone!
Gently stroke the back of the person to your right!
Tell the person opposite you what you find most charming about them!
Give someone of your choice a 60-second hand massage!
Tell the most attractive person here what makes them special!
Describe your ideal date night to the person on your right!
Kiss the hand of the most attractive person here!
Tell the person next to you what you admire most about them!
Maintain close eye contact with the person to your right for 30 seconds!
Dance around someone of your choice like you're in a music video for 20 seconds!
Whisper to the person on your left what you think is really cool about them!
Gently stroke the hand of the person opposite you!
Kiss the person to your right on the nose!
Describe your wildest kiss to the person next to you!
Lean on the shoulder of the person to your left for 30 seconds!
Do a partner dance with someone of your choice for at least 20 seconds!
Whisper your biggest dream to the most attractive person here!
Gently stroke the face of the person to your right!
Give the person to your left a 15-second foot massage!
`, "hotmild", "action"),

  // Wild: Actions

  ...cardsEN(`
Take off an accessory!
Swap an accessory (e.g., a hat, scarf, or watch) with the person to your right!
Wear your sweater or jacket inside out for one round!
Blow a movie-worthy kiss to someone of your choice!
Swap an accessory with the person opposite you!
Kiss the hand of the person to your right!
Take off your shoes and play the next round barefoot!
Give the person to your left a kiss on the cheek!
Sit right next to the most attractive person here for two rounds!
Take off an accessory and give it to the person on your right!
Give someone of your choice a 30-second hug!
Swap socks with the person to your left!
Blow the most dramatic kiss you can to the person opposite you!
Hand over two accessories as a deposit – you get them back after three rounds!
Give the person to your right a high five and a genuine compliment!
Feed the person opposite you a snack!
Kiss the most attractive person here on the cheek!
Swap an accessory with someone of your choice!
Give the person to your right an Eskimo kiss (rub noses together)!
Swap your hat or another accessory with the most attractive person here!
The group chooses an accessory you must hand over until the end of the game!
Give the person to your left a big hug!
Give the most attractive person here one of your accessories as a deposit!
Kiss the hand of someone of your choice!
Swap jackets with the person on your right!
Take off your shoes and play the next round in socks!
Bow to the most attractive person here and give them a compliment!
Hold hands with the person to your right for 15 seconds!
Swap an accessory with the person to your left!
Sit close to the person to your right and hold their hand!
Swap a hat, glasses, or necklace with the most attractive person!
Place your phone face-up on the table for three rounds!
The person to your left chooses: a cheek kiss, a hand kiss, or a hug!
Swap shoes with the person on your right!
The person opposite you chooses an accessory you must hand over for one round!
Hold hands with someone of your choice for the next round!
Hug someone of your choice for 15 seconds!
Act out a romantic movie scene with a randomly chosen person!
Honestly rate someone's outfit from 1 to 10 and explain why!
Speak in an exaggerated radio announcer voice for one round.
Describe your perfect partner without naming a gender or a person.
Say who in this group you'd most like to go on a date with.
Invent an absurd but convincing reason why the two of you should get married.
Someone else asks you a question that you have to answer honestly.
Say who in the group you think would be the best kisser – just based on your impression.
Name three qualities that instantly make you weak for someone.
Pick two people you think would make a great couple.
Let someone rate your flirting skills from 1 to 10.
Invent a creative pickup line and use it on someone.
Deliver your worst pickup line.
Tell your most embarrassing dating story.
Show your oldest selfie.
Act like an absurdly jealous partner for one round.
Describe your latest crush using three emojis.
Tell someone what you first noticed about them.
Give someone a new flirty nickname.
Tell someone which song reminds you of them.
Let the person opposite you choose a question you have to answer honestly.
Pick someone and describe your perfect first date together.
Say who here you'd most like to watch the sunrise with.
Invent a couple nickname for yourself and another person.
Let someone choose your answers for one round.
Make a dramatic declaration of love to the person on your left.
Flirt with an object in the room.
Reveal your most embarrassing old nickname.
Show your most-used emoji.
You get to sit this round out – BREAK!
Someone of your choice may take one of your accessories and keep it for one round.
Act out a dramatic love scene with an empty bottle!
Pretend to die a dramatic movie death!
Invent a secret handshake with the person opposite you!
Mime your perfect date – everyone else has to guess!
Give each other three compliments!
Share a secret with each other!
Share a drink together!
Give each other a one-minute shoulder massage!
Take a photo together!
You get a breather this round!
`, "hot", "action"),

  // Wild – Mild: Questions

  ...cardsEN(`
Have you ever had a crush on someone who was off-limits (e.g., your best friend's ex)?
Who here would be most likely to complete a marathon?
What would you do if you were stranded on an island with someone here?
What's your absolute deal-breaker when dating?
Who here would make the best date, and why?
What unexpected trait secretly makes you fall for someone?
Who here would you most like to go on a spontaneous vacation with?
What's the bravest thing you've ever done on a date?
Who here has the most charming presence?
What's the first thing you notice about someone?
Have you ever dreamed about someone here?
Who here would you most like to kiss?
What's the most romantic thing you've ever said?
Who here has the most infectious laugh?
What would your dream date with someone here look like?
Have you secretly glanced at someone here tonight?
What rule would you secretly love to break?
Who here would you most likely share a secret with?
Who here has the most attractive voice?
What's the nicest compliment you've ever received from a crush?
What's at the very top of your bucket list?
Who here has the prettiest eyes?
What's the most embarrassing flirty text you've ever sent?
Who here would you most like to take a road trip with?
Who here gives off the most confidence?
Have you ever had a weird dream about someone here?
What do you secretly find cute but would never admit?
Who here would make the best movie star?
Have you ever taken a screenshot of a message from someone here?
Who here would be the best storyteller?
What's the most romantic thing you've experienced on vacation?
Who here would you most like to have a movie night under a blanket with?
Who here has the most attractive hands?
Have you ever secretly thought someone here was cute?
What's your biggest guilty-pleasure TV show?
Who here would you most like as a roommate?
What's the most romantic thing you've ever done on a date?
Who here would be the best audiobook narrator?
What's the most embarrassing thing that's ever happened to you in public?
What topic secretly fascinates you but you never talk about?
Who here is the best dancer?
Who here would you most like to spend a weekend with?
What's the strangest dream you've ever had?
Who here has the best style?
Have you ever imagined kissing someone here?
What's something you absolutely want to experience someday?
Who here would you most like to play a game with – and which game?
Who here has the most charming smile?
What's the cheesiest love message you've ever written?
Have you ever secretly admired someone here from afar?
What would your perfect romantic evening with someone here look like?
`, "hotmild"),

  // Wild: Questions

  ...cardsEN(`
What's your absolute deal-breaker on a first date?
Who in this group would you most like to invite over for dinner?
What does your perfect spontaneous evening look like?
What's the wildest thing you've done at a concert or festival?
What's your secret dream date scenario?
Where are you the most ticklish?
What wish have you never said out loud?
Describe your wildest kiss!
What's the boldest outfit you've ever worn?
Who here would you be most likely to ask on a date?
Describe your perfect kiss!
What's the sweetest thing someone has ever whispered in your ear?
What's the bravest thing you've ever tried for a crush?
Who here would you most like to kiss – and how?
Describe your wildest night out!
Who here has the best party energy?
What's one boundary you would never cross?
What does your perfect cuddle night look like?
How would you ask someone here on a date? Show us!
What would your perfect adventure for two look like?
What's the most embarrassing pajamas you've ever worn?
Who here would you most like to take to karaoke?
What's your favorite party game?
What's the funniest thing you've ever whispered in someone's ear?
Who here would you most like to take to a deserted island?
What would you only admit in this group?
What would your craziest party night with someone here look like?
What's the boldest date suggestion you've ever made?
What would your perfect day with someone here look like?
What's the most embarrassing thing that's happened to you in a changing room?
Who here would have the craziest ideas for a group vacation?
What's the boldest thing you've ever done at a party?
What's the craziest thing you've ever done at a swimming pool or lake?
When was the last time you laughed really hard, and why?
Which swear word do you use most often?
Who here would you most like to flirt with – and why?
Who has the nicest smile?
Who would you most like to talk with all night?
What was your best date ever?
What instantly makes someone attractive to you?
Do you believe in love at first sight?
What's your idea of a perfect first date?
What's your biggest green flag?
Who looks better than they think they do?
What's the most embarrassing thing you've ever done for someone?
What's the worst rejection you've ever received?
Have you ever dated someone just because you were bored?
Have you ever intentionally ignored a message after reading it?
What's most important to you when kissing?
Roughly how many dates did you go on last year?
Would you date someone whose hobbies are completely different from yours?
How many people have you kissed?
Would you be in a long-distance relationship?
Would you give your ex a second chance?
Would you move to another country for true love?
Have you ever sent a message and immediately regretted it?
Have you ever deliberately made someone jealous?
Have you ever dated someone even though you knew it wouldn't go anywhere?
Have you ever hidden a crush from your best friend?
Have you ever dated someone just for their looks?
Have you ever rejected someone even though you were interested?
What was your most embarrassing date outfit?
Who here would you introduce to your parents?
Who here would you call at 3 a.m.?
Who here would you swipe right on in a dating app?
Who here would be most likely to make you break your dating rules?
`, "hot"),
];

// ============================================================
// CHAOS – QUESTIONS, ACTIONS AND SPECIAL CARDS
// ============================================================

export const hardcoreQuestionsEN = [
  // Chaos: Questions

  ...cardsEN(`
What's the worst thing you've ever done without getting caught?
Have you ever intentionally hurt someone?
What's the strangest thought you've ever had?
Have you ever revealed a secret someone trusted you with?
What's the most scandalous thing you've ever done?
Have you ever cheated on someone and never admitted it?
What's the biggest taboo you've ever broken?
Have you ever played dirty?
What's the most embarrassing thing that's happened to you on a date?
Have you ever deliberately humiliated someone?
What's the grossest thing you've ever eaten?
Have you ever betrayed someone?
What's the most dangerous thing you've ever done?
What's the craziest thing you've ever done for money?
Have you ever persuaded someone to play a game they didn't want to play?
What's the most scandalous thing you've ever done at a party?
What's the worst thing you've ever said?
What's the craziest thing you've ever said in your sleep?
When did you last go number two?
Have you ever dated someone and then simply dropped them?
Have you ever thought about someone else while kissing?
What's the silliest thing you've ever done out of boredom?
What's the most scandalous thing you've done on vacation?
What's the meanest thought you've had today?
Have you ever deliberately manipulated someone?
What's the craziest thing you've ever drunk?
Have you ever deliberately annoyed someone and found it funny?
What's the most scandalous thing you've ever written?
Have you ever deliberately cheated on someone and regretted it?
What's the most dangerous thing you've ever said?
Have you ever laughed at someone and regretted it later?
What's the craziest thing you've ever done with someone?
What's the worst thing you've ever done without regretting it?
What's the craziest thing you've ever done with your best friend?
Have you ever flirted with someone and regretted it afterward?
What's the craziest thing you've ever done at a party?
What's the worst thing you've ever done on a date?
Have you ever deliberately manipulated someone and regretted it?
What's the craziest thing you've ever done for someone?
What's the grossest thing you've ever seen at a party?
What's the worst thing you've ever done with someone here?
What's the most scandalous thing you've ever done with someone here?
What's the craziest thing you've experienced on a road trip?
What's the worst joke you've ever told?
What's the most dangerous thing you've ever done with someone here?
What's the biggest lie you've told in a relationship?
Who did you last lie to?
What's something nobody here knows about you?
Who from your life do you secretly miss?
What are you secretly jealous of?
What's your biggest insecurity?
What truth about yourself would you most like to hide?
Which ex would you never speak to again, and why?
Have you ever broken up with someone even though you still loved them?
Have you ever flirted with someone even though you knew they were taken?
Which relationship do you regret the most?
Who in this group would you trust with your house key?
Who would you never recommend as a partner to your best friend?
What trait would you hide from your future partner?
What's the meanest thing you've done because of heartbreak?
Who here seems the most athletic?
`, 3),

  // Chaos: Actions

  ...cardsEN(`
Confess your biggest secret to the group!
Show the group an embarrassing photo of yourself!
Call someone and say something embarrassing!
Swap seats and drinks with the person on your right!
Make a suggestion everyone has to join in on!
Tell the group about your worst date!
Let the group choose a challenge for you!
Let the group choose an accessory you have to wear!
Write a message to your ex, then read it to the group without sending it!
Tell the group your biggest taboo!
Eat three uncooked pieces of pasta.
Eat a teaspoon of mustard!
Run around the group once shouting: 'I'm the legend of this party!'
Tap the person on your left on the shoulder and give them a compliment!
Wear an accessory or costume chosen by the group until the game ends!
Hand out five sips to other players.
Make a declaration of love to a doorknob!
Let the person on your left dab a little mayonnaise on your nose – leave it there for one round!
Whisper a word into the ear of the person on your right – they must act it out!
Describe another player's ear as poetically as possible!
Create a partner dance with someone of your choice and perform it!
Eat a slice of lemon without making a face!
Draw an invisible mustache on another player's face with your finger!
Tickle another player for five seconds (with their consent)!
Peel a banana using only one hand!
Fill your mouth with ketchup.
Knight another player with an imaginary sword!
Give a 30-second speech declaring your love to the fridge!
Send a sincere compliment to the seventh person in your chat history!
You may hand out six sips to other players.
Make a confession to the group!
Let the group choose a penalty for you!
Call someone and confess something!
Swap shoes with the person on your left!
Tell the group about your most embarrassing moment.
Let the group decide who you send a message to!
Tell the group about your wildest night out!
Call someone and sing to them!
Tell the group about your worst kiss!
Let the group choose a hat or costume for you!
Call someone and confess your feelings!
Let the group guess a true fact about you!
Make a promise to the group that you have to keep!
Tell the group about your most embarrassing dream!
Let the group choose a challenge for the next round!
Call someone and tell them a secret!
Confess your secret music or movie tastes to the group!
Let the group decide who you have to call!
Call someone and say something confusing!
Play the group your most recent voice message that you sent.
Let the group choose a penalty for the next round!
Make the group an offer everyone has to take part in!
Let the group ask you a question!
Call someone and whisper something to them!
Make the group a promise for next week!
Let the group choose a task for the next hour!
Call someone and confess something embarrassing!
Let the group decide what you say next!
Let the group choose a challenge for everyone this round!
`, "hardcore", "action"),

  ...cardsEN(`
Name three people you find attractive.
`, "hardcore"),

  ...cardsEN(`
Tell the group what you last talked about with your crush.
Name your current crush.
Say who in this group you'd kiss.
Reveal your biggest dating secret.
Say who you last found attractive.
Tell your most embarrassing flirting fail.
Show your first selfie.
Everyone writes down a name; the person with the most votes gets a challenge.
`, "hardcore", "action"),

  // Chaos: Group Decisions

  ...cardsEN(`
The group chooses the bravest player for the next task!
The group decides who buys the next round!
The group chooses who has to reveal a secret next!
The group chooses the most charming player for the next task!
The group decides who has to call someone next!
The group nominates the player with the wildest story!
The group decides who has to swap an accessory!
The group nominates the player with the worst date!
The group decides who has to make a confession!
The group chooses the player who has the most to hide!
The group nominates the player with the biggest taboo!
The group chooses the player most likely to lie!
The group decides who has to show an embarrassing photo!
The group nominates the player with the most vivid imagination!
The group decides who has to share a secret next!
The group nominates the player with the worst secret!
The group decides who gets the next penalty!
Two players mime cooking a Bolognese and narrate it like a cooking show!
`, null, "group_decision"),

  // Chaos: Double Challenges

  ...cardsEN(`
Two players have to do 10 push-ups together!
Two players have to perform a dance together!
Two players have to tell a story together!
Two players have to have an arm-wrestling contest!
Two players have to whisper something to each other!
Two players have to ask each other a question!
Two players have to imitate each other!
Two players have to solve a task together!
Two players have to kiss each other on the cheek!
Two players have to sing a song together!
Two players have to propose a challenge together!
Two players have to confess something to each other!
Two players have to challenge each other!
Two players have to make a promise to each other!
Two players have to tell each other something embarrassing!
`, null, "double_challenge"),

  // Chaos: Blackout

  ...cardsEN(`
Have you ever lied? (Blackout: Do NOT say 'Yes'!)
Have you ever cheated? (Blackout: Do NOT say 'Yes'!)
Have you ever stolen something? (Blackout: Do NOT say 'Yes'!)
Have you ever hurt someone? (Blackout: Do NOT say 'Yes'!)
Have you ever revealed a secret? (Blackout: Do NOT say 'Yes'!)
Have you ever hidden a hangover from your parents? (Blackout: Do NOT say 'Yes'!)
Have you ever lied to protect someone? (Blackout: Do NOT say 'Yes'!)
Have you ever deliberately hurt someone? (Blackout: Do NOT say 'Yes'!)
Have you ever played dirty? (Blackout: Do NOT say 'Yes'!)
Have you ever deliberately deceived someone? (Blackout: Do NOT say 'Yes'!)
Have you ever deliberately tricked someone? (Blackout: Do NOT say 'Yes'!)
Have you ever deliberately manipulated someone? (Blackout: Do NOT say 'Yes'!)
Have you ever ghosted someone? (Blackout: Do NOT say 'Yes'!)
Have you ever deliberately embarrassed someone in public? (Blackout: Do NOT say 'Yes'!)
Have you ever deliberately made someone jealous? (Blackout: Do NOT say 'Yes'!)
Have you ever cheated at a drinking game? (Blackout: Do NOT say 'Yes'!)
`, null, "blackout"),

  // Chaos: Wagers / Risk Cards

  ...cardsEN(`
Can you do 20 push-ups?
Can you balance on one leg for 30 seconds?
Can you balance a spoon on your nose for 10 seconds?
Can you say the alphabet backwards?
Can you go 30 seconds without laughing?
Can you do a handstand?
Can you eat an apple in three bites?
Can you go 30 seconds without blinking?
Can you whistle a song?
Can you spin around for 30 seconds without falling over?
Can you balance a plastic cup of water on your head?
Can you spell your name backwards?
Can you hold your breath for 15 seconds?
Can you do a cartwheel?
Can you stand on one leg with your eyes closed?
Can you do 20 squats?
Can you count backwards from 20?
Can you flick a bottle cap off a table with your finger?
Can you balance a small stick on your finger for 20 seconds?
Can you come up with a rhyme in five seconds?
Can you stack three glasses?
Can you wink with just one eye?
Can you yodel for 10 seconds?
Can you sing a song from memory?
Can you do a handstand against a wall?
Can you stay silent for one minute?
`, null, "risk_card"),
];
