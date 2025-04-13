const dummyChats = [
    {
      _id: "1",
      avatar: "https://example.com/avatar1.jpg",
      name: "John Doe",
      lastMessage: "Hey, how are you?",
      messages: [
        { _id: "1", sender: "John Doe", message: "Hey, how are you?", time: "10:00 AM" },
        { _id: "2", sender: "You", message: "I'm good, thanks!", time: "10:05 AM" },
      ],
      isGroup: false,
      userId: { _id: "1", profileImage: "https://example.com/avatar1.jpg" },
      lastMessageTime: new Date(),
    },
    {
      _id: "2",
      avatar: "https://example.com/avatar2.jpg",
      name: "Jane Smith",
      lastMessage: "See you tomorrow!",
      messages: [
        { _id: "1", sender: "Jane Smith", message: "See you tomorrow!", time: "09:00 AM" },
        { _id: "2", sender: "You", message: "Sure, see you then!", time: "09:05 AM" },
      ],
      isGroup: false,
      userId: { _id: "2", profileImage: "https://example.com/avatar2.jpg" },
      lastMessageTime: new Date(),
    },
  ];