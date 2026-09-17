# Activity: Absurd Wireshark Feature Design Challenge

## Objective

Work as a team to invent an **absurd feature for Wireshark**.

Your feature should be intentionally strange, funny, or impractical.

The goal is not to write code. Instead, think creatively about how Wireshark could be changed to do something that it was never designed to do.

## How to Play

### Form Teams

Work in teams of **2–4 students**.

Choose one team member or two to present your idea to the class.

### Design Your Absurd Feature

Your team must answer these four questions:

1. **What is your absurd feature?**

   Describe what your feature does.

2. **How would someone use it?**

   Explain how a Wireshark user would trigger or interact with the feature; if the feature requires extra hardware, describe it briefly.

3. **Why could it actually be useful?**

   Give one situation in which your absurd feature could somehow be helpful.

4. **What is one drawback?**

   Identify one problem, limitation, or ridiculous consequence of your feature.

You do **not** need to explain how the feature would be implemented in C/C++, and you do not need to write any code.

### Present

Each team will give a short **2–3 minute verbal presentation**.

No slides are required.

Your presentation should include:

* The name of your feature
* What it does
* How a user would use it
* One situation where it could be useful
* One drawback

### Voting & Awards

The class will vote for the **Most Absurd Wireshark Feature**.

The winning team receives **+0.3% extra credit** toward the final course grade.

## Example: Push-Up Packet Capture

- Wireshark can only capture one packet at a time. After every packet is captured, Wireshark pauses the capture and requires the user to perform one push-up. Once the push-up is detected, Wireshark resumes capturing and waits for the next packet.

- Extra hardware/software:

  - Webcam or motion-tracking camera
  - Push-up detection software using computer vision
  - Wireshark plugin that communicates with the detection software
  - Optional: smartwatch or fitness tracker to verify the push-up

- Helpful scenario: Keeps network administrators awake during overnight incident response; increases local coffee shop revenue.

- Drawback: Long packet captures become extremely expensive.
