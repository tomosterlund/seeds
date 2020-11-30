const EmailLimit = require('../../../Models/TTLdata/emaillimit');

const emailLimitCheck = async (userId) => {
    const emaillimit = await EmailLimit.findOne({ userId: userId });
    if (emaillimit) {
        if (emaillimit.emailCount >= 5) { //Checks if course author should stop receiving emails for the 12 hour period since receiving the 1st
            return false
        }

        // Adds count to the course author's email limit, which is 5 per 12 hours
        emaillimit.emailCount += 1;
        await emaillimit.save();
    } else if (!emaillimit) { // if course author has not yet received any emails during the last 12 hours
        const newLimit = new EmailLimit({
            userId: userId,
            emailCount: 1
        });
        await newLimit.save();
    }
}

module.exports = emailLimitCheck;