const Problem = require("../models/problem");

async function recommendProblems(user) {
    if (!user.problemSolved || user.problemSolved.length === 0) {
        return await Problem.aggregate([
            { $sample: { size: 10 } }
        ]);
    }

    const recentSolvedIds = user.problemSolved.slice(-5);

    const solvedProblems = await Problem.find(
        {_id: { $in: recentSolvedIds } },
        { tags: 1 }
    );

    const tagSet = new Set();

    solvedProblems.forEach(problem => {
        problem.tags.forEach(tag => tagSet.add(tag));
    });

    const preferredTags = [...tagSet];

    const recommendedProblems = await Problem.aggregate([
        {
            $match: {
                tags: { $in: preferredTags },
                _id: { $nin: user.problemSolved }
            }
        },
        { $sample: { size: 10 }}
    ]);

    return recommendedProblems;
}

module.exports = { recommendProblems };