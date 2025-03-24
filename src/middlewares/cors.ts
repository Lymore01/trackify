import cors from "cors";

export const corsOptions = cors({
    origin:"*", //! fix: change to specific domains in production
    methods: ["POST", "GET", "DELETE"]
})