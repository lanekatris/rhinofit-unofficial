![npm link](https://badgen.net/npm/v/@lkat/rhinofit-unofficial)
![types link](https://badgen.net/npm/types/tslib)

# Unofficial Rhinofit Gym Management Software SDK
[rhinofit.ca](https://www.rhinofit.ca/)

[npm package](https://www.npmjs.com/package/@lkat/rhinofit-unofficial)

⚠️ No affiliation with Rhinofit. Rhinofit is a trademark of Rhinofit. ⚠️

Do not abuse their API, no endless loops 😉

# Why
Rhinofit's UI is lacking... and their embedded forms log you out quickly. This is meant to automate workign with their platform like scheduling workout sessions or whatever else that comes up!

# Examples
```javascript
import {AuthenticationService, Days, GymScheduleService} from "@lkat/rhinofit-unofficial";

// Login
// Be nice and persist these cookies (credentials object) if possible so you don't call login all the time
const authService = new AuthenticationService();
const credentials = await authService.login({
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
});

// Register for the 6pm time slot for Monday, Wednesday, and Friday THIS WEEK
// Limitation: Only works with THIS WEEK. Only supports the SAME TIME each day
const scheduleService = new GymScheduleService({
    gymId: "a1c0a008", // See below how to find these values
    timeSlotIds: {
      16: "125396", // You need to provide other IDs if you want to support other time slots
      18: "125397",
      20: "125398",
    },
});
const response = await scheduleService.registerForThisWeek({
    credentials,
    hourOfDay: 18, // 6pm - 24h format
    days: [Days.Monday, Days.Wednesday, Days.Friday],
});


```

# How to find your gym ID?
![find gym id](https://user-images.githubusercontent.com/3193546/111081676-dec32500-84da-11eb-94f8-11264485d4aa.gif)



# How to find your time slot IDs?
In the same payload as the GIF above; every timeslot you choose you will see a different `ct_id`. This is what you want (without the dash and after that).

![Screenshot from 2021-03-14 15-32-47](https://user-images.githubusercontent.com/3193546/111081656-b76c5800-84da-11eb-980e-f8c34bd56efd.png)


# References
* [Awesome Typescript and Lerna tutorial](https://blog.logrocket.com/setting-up-a-monorepo-with-lerna-for-a-typescript-project-b6a81fe8e4f8/)
