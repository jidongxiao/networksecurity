## Programming Assignment: The Wireshark Patch

## Overview

Wireshark is the industry-standard tool for packet analysis. In this assignment, you will modify the Wireshark source code to implement a small feature of your choice that is related to Computer Networks, or Network Security. Your feature should demonstrate an application of concepts from this course, such as network protocols, packet analysis, network attacks, defenses, monitoring, or other aspects of network security.

You can find the Wireshark source code [here](https://github.com/wireshark/wireshark).

## Learning Objectives

- Understanding the architecture and source code of Wireshark.
- Understanding how Wireshark captures, processes, and displays network packets.
- Gaining experience modifying an existing large-scale C/C++ software project.
- Learning how to build and run a modified version of Wireshark from source.
- Applying C/C++ programming skills to implement a new feature in a network security tool.

## Group Project

This is a **group project**. You may work individually or form a group of **up to 4 students**.

* Group size: **1–4 students**
* You are encouraged to work with other students, but **working individually is also allowed**.
* All members of a group should contribute to the implementation and understand the submitted code.
* A group submits **one patch and one README**.
* All group members should participate in the live demonstration.

## Get the Required Wireshark Version

You must modify **Wireshark v3.2.3** for this assignment. Do not use the current `master` branch or another Wireshark release.

Clone the Wireshark repository and check out the `v3.2.3` tag:

```bash
git clone https://github.com/wireshark/wireshark.git
cd wireshark
git checkout v3.2.3
```

Verify that you are using the required version:

```bash
git describe --tags --exact-match
```

The command should output:

```text
v3.2.3
```

You can also verify the commit with:

```bash
git status
```

You should see that you are currently on the `v3.2.3` tag.

**Important:** Make your modifications starting from this exact version of the source tree. Your final patch must be generated against the unmodified `v3.2.3` source tree:

```bash
git diff v3.2.3 > patch.diff
```

## Feature Criteria & Requirements

- Demonstrability: Your feature must be clearly visible or audible during a live demonstration.

- UI Changes Are Allowed: Your feature may primarily involve changes to the Wireshark user interface. However, you must be able to justify why the UI change would be useful.

- Code Volume: Your submission must consist of approximately 400–600 lines of C/C++ source code added or modified within the Wireshark source tree. The line count will be evaluated from your submitted patch. Excluded: auto-generated files (bison/flex output), formatting-only changes, build scripts, and auto-generated XML files. Do not artificially inflate the line count through formatting-only changes, unnecessary deletions, or other changes unrelated to your feature.

## Build and Run Requirement

After implementing your feature, you must be able to **compile and run your modified version of Wireshark in the course VM**.

Your submitted patch must therefore contain changes that build successfully against **Wireshark v3.2.3** on the course VM and produce a working Wireshark executable with your feature implemented.

You must test your modified Wireshark in the course VM before submitting your patch. During the live demonstration, you should be able to launch your modified Wireshark and demonstrate your feature.

**Important:** A patch that only modifies the source code but does not successfully compile and run in the course VM does not satisfy the assignment requirements.

## Submission Deliverables

Submit the following 2 files on Submitty. Due Date: 11:59, Friday, Oct 30th, 2026.

- a diff patch: A clean, unified git patch generated against v3.2.3

```bash
git diff v3.2.3 > patch.diff
```

- A txt or md README file containing:

  - Feature Title & Description: What the feature does and how to trigger it.

  - The Justification: Explaining when and why this feature can be useful.

  - Modified Files List: Breakdown of C/C++ files and why each file is changed.

## Grading Rubric

12 pts

- Live Demonstration: (4pts)
- The diff patch: (4pts)
- README file: (4pts)
