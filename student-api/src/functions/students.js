const {
    app
} = require("@azure/functions");

const {
    sql,
    getPool
} = require("../db");


app.http("students", {

    methods: ["GET", "POST"],

    authLevel: "anonymous",

    route: "students",

    handler: async (request, context) => {

        context.log(
            `Request received: ${request.method}`
        );


        // =========================
        // POST
        // =========================

        if (request.method === "POST") {

            try {

                const body =
                    await request.json();


                const {
                    fullName,
                    email,
                    course
                } = body;


                // Basic validation

                if (
                    !fullName ||
                    !email ||
                    !course
                ) {

                    return {

                        status: 400,

                        jsonBody: {

                            message:
                                "Full name, email and course are required."

                        }

                    };

                }


                const pool =
                    await getPool();


                await pool
                    .request()

                    .input(
                        "FullName",
                        sql.VarChar(100),
                        fullName
                    )

                    .input(
                        "Email",
                        sql.VarChar(150),
                        email
                    )

                    .input(
                        "Course",
                        sql.VarChar(100),
                        course
                    )

                    .query(`
                        INSERT INTO Students
                        (
                            FullName,
                            Email,
                            Course
                        )
                        VALUES
                        (
                            @FullName,
                            @Email,
                            @Course
                        )
                    `);


                return {

                    status: 201,

                    jsonBody: {

                        message:
                            "Student registered successfully!"

                    }

                };


            } catch (error) {

                context.error(error);

                return {

                    status: 500,

                    jsonBody: {

                        message:
                            "Database operation failed.",

                        error:
                            error.message

                    }

                };

            }

        }


        // =========================
        // GET
        // =========================

        if (request.method === "GET") {

            try {

                const pool =
                    await getPool();


                const result =
                    await pool
                        .request()
                        .query(`
                            SELECT
                                StudentID,
                                FullName,
                                Email,
                                Course,
                                RegistrationDate
                            FROM Students
                            ORDER BY StudentID DESC
                        `);


                return {

                    status: 200,

                    jsonBody:
                        result.recordset

                };


            } catch (error) {

                context.error(error);

                return {

                    status: 500,

                    jsonBody: {

                        message:
                            "Unable to retrieve students.",

                        error:
                            error.message

                    }

                };

            }

        }


        return {

            status: 405,

            jsonBody: {

                message:
                    "Method not allowed."

            }

        };

    }

});

