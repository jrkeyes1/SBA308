// The provided course information.
const CourseInfo = {
  id: 451,
  name: "Introduction to JavaScript"
};

// The provided assignment group.
const AssignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  course_id: 451,
  group_weight: 25,
  assignments: [
    {
      id: 1,
      name: "Declare a Variable",
      due_at: "2023-01-25",
      points_possible: 50
    },
    {
      id: 2,
      name: "Write a Function",
      due_at: "2023-02-27",
      points_possible: 150
    },
    {
      id: 3,
      name: "Code the World",
      due_at: "3156-11-15",
      points_possible: 500
    }
  ]
};

// The provided learner submission data.
const LearnerSubmissions = [
  {
    learner_id: 125,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-25",
      score: 47
    }
  },
  {
    learner_id: 125,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-02-12",
      score: 150
    }
  },
  {
    learner_id: 125,
    assignment_id: 3,
    submission: {
      submitted_at: "2023-01-25",
      score: 400
    }
  },
  {
    learner_id: 132,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-24",
      score: 39
    }
  },
  {
    learner_id: 132,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-03-07",
      score: 140
    }
  }
];

function getLearnerData(course, ag, submissions) {
  // Check if the assignment group belongs to the correct course
  if (ag.course_id !== course.id) {
    throw new Error("AssignmentGroup course_id does not match CourseInfo id");
  }

  // Get the current date to compare with assignment due dates
  const currentDate = new Date();
  
  // Object to store data for each learner
  const learnersData = {};

  // Iterate through each submission
  submissions.forEach(submission => {
    // Find the corresponding assignment for each submission
    const assignment = ag.assignments.find(a => a.id === submission.assignment_id);
    if (!assignment) {
      throw new Error("Assignment not found");
    }

    // Convert due date and submission date to Date objects for comparison
    const dueDate = new Date(assignment.due_at);
    const submittedDate = new Date(submission.submission.submitted_at);

    // Skip assignments not yet due
    if (dueDate > currentDate) {
      return;
    }

    // Initialize data structure for each learner if not already done
    if (!learnersData[submission.learner_id]) {
      learnersData[submission.learner_id] = {
        id: submission.learner_id,
        avg: 0,
        totalPoints: 0,
        totalWeightedScore: 0
      };
    }

    const learnerData = learnersData[submission.learner_id];

    let score = submission.submission.score;

    // Deduct 10% if the assignment was submitted late
    if (submittedDate > dueDate) {
      score -= assignment.points_possible * 0.1;
    }

    // Calculate the percentage score for the assignment and store it
    learnerData[assignment.id] = (score / assignment.points_possible).toFixed(2);
    learnerData.totalPoints += assignment.points_possible;
    learnerData.totalWeightedScore += score;
  });

  // Convert the learnersData object into the desired array format
  return Object.values(learnersData).map(learnerData => {
    // Calculate the average score for each learner
    learnerData.avg = (learnerData.totalWeightedScore / learnerData.totalPoints).toFixed(2);
    // Clean up temporary properties
    delete learnerData.totalPoints;
    delete learnerData.totalWeightedScore;
    return learnerData;
  });
}

// Call the function with the provided data and store the result
const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);

// Log the result to the console
console.log(result);