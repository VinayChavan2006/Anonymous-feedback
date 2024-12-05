export async function POST(req: Request) {
  const MessageList = [
    { message: "If you could have any superpower, what would it be and why?" },
    { message: "What's the most unusual food you've ever tried?" },
    {
      message: "If you could travel anywhere in the world, where would you go?",
    },
    { message: "What's the funniest thing that happened to you recently?" },
    {
      message:
        "If you could meet any historical figure, who would it be and why?",
    },
    { message: "What's your favorite movie or TV show and why?" },
    {
      message:
        "If you could switch lives with someone for a day, who would it be?",
    },
    { message: "What's the most interesting fact you know?" },
    {
      message:
        "If you could have dinner with any three people, dead or alive, who would they be?",
    },
    {
      message:
        "What's a hobby or activity you've always wanted to try but haven't yet?",
    },
    {
      message: "What's your favorite Song Currently?"
    },
    {
      message:"What’s something you’ve learned recently that surprised you?"
    },
    {
      message: "If you could instantly master any skill, what would it be and why?"
    },
    {
      message: "What’s a book, movie, or song that always brings you comfort?"
    },
    {
      message: "What’s one thing you think everyone should try at least once in their life?"
    },
    {
      message: "When faced with a tough decision, do you follow your heart, your head, or flip a coin?"
    },
    {
      message: "Do you believe people can truly change, or do they always stay the same at their core?"
    },
    {
      message: "If you had to choose between being rich and lonely or poor and surrounded by loved ones, which would you pick?"
    },
    {
      message: "What’s something that always makes you feel at peace, no matter what’s going on around you?"
    },
    {
      message: "When you’re upset, do you prefer to talk about it or deal with it on your own?"
    },
    {
      message: "If you could change one thing about your past, would you? Why or why not?"
    },
    {
      message: "Do you believe in fate, or do you think we control our own destiny?"
    },
    {
      message : "When you’re feeling stressed, what’s your go-to coping mechanism?"
    },
    {
      message :"If you could erase one fear or insecurity, what would it be?"
    },
    {
      message : "If your life was a book, what would the title be?"
    }
  ];
  const numbers: any = [];
  while (numbers.length < 3) {
    const randomNum = Math.floor(Math.random() * MessageList.length);
    if (!numbers.includes(randomNum)) {
      numbers.push(randomNum);
    }
  }

  const messages = [MessageList[numbers[0]].message,MessageList[numbers[1]].message,MessageList[numbers[2]].message]
  return Response.json({
    success:true,
    message : 'Message Suggested Successfully',
    suggestions : messages.join('|')
  })
}
