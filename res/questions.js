let questions = {
    "Applications Development": [
        {
            "type": "identification",
            "question": "This is a style of programming.",
            "answer": ["Language Paradigm", "Paradigm"]
        },
        {
            "type": "identification",
            "question": "This paradigm is based on the concept of objects (state and behavior).",
            "answer": ["Object-oriented", "Object-oriented Paradigm", "Object-oriented Programming Paradigm"]
        },
        {
            "type": "identification",
            "question": "This paradigm utilizes control flow constructs.",
            "answer": ["Structured", "Structured Paradigm", "Structured Programming Paradigm"]
        },
        {
            "type": "identification",
            "question": "This paradigm mimics a function in mathematics. ",
            "answer": ["Functional", "Functional Paradigm", "Functional Programming Paradigm"]
        },
        {
            "type": "identification",
            "question": "This paradigm uses facts and rules.",
            "answer": ["Logic", "Logic Paradigm", "Logic Programming Paradigm"]
        },
        {
            "type": "identification",
            "question": "This stage is the implementation of the design phase in the SDLC.",
            "answer": "Application development stage"
        },
        {
            "type": "multiple-choice",
            "question": "Translate source code (written in a programming language) into the computer language (object code)",
            "options": [
                "Compiler",
                "Interpreter",
                "Assembler",
                "Decompiler"
            ],
            "answer": "Compiler"
        },
        {
            "type": "multiple-choice",
            "question": "Used in assembly language to convert the source code into the machine language",
            "options": [
                "Compiler",
                "Interpreter",
                "Assembler",
                "Decompiler"
            ],
            "answer": "Assembler"
        },
        {
            "type": "multiple-choice",
            "question": "“Reverse-engineer” the translation performed by compilers and assemblers",
            "options": [
                "Compiler",
                "Interpreter",
                "Assembler",
                "Decompiler"
            ],
            "answer": "Decompiler"
        },
        {
            "type": "multiple-choice",
            "question": "Translates source code into the target machine code “on-the-fly” (reads source code, converts it and executes it directly)",
            "options": [
                "Compiler",
                "Interpreter",
                "Assembler",
                "Decompiler"
            ],
            "answer": "Interpreter"
        },
        {
            "type": "true-or-false",
            "question": "Obfuscators are used to reduce the size of a program’s source code without modifying the program's functionality.",
            "answer": "False"
        },
        {
            "type": "true-or-false",
            "question": "Obfuscators perform deliberate modifications to program code to make it more difficult to understand, without changing the code’s functionality.",
            "answer": "True"
        },
        {
            "type": "true-or-false",
            "question": "Code Beautifier is used to improve the presentation of source code for purposes of readability and conformance to some coding standards.",
            "answer": "True"
        },
        {
            "type": "true-or-false",
            "question": "Code Minifier is used to reduce the size of a program’s source code without modifying the program’s functionality.",
            "answer": "True"
        },
        {
            "type": "true-or-false",
            "question": "Transpiler translate source code into the target machine code “on-the-fly” (reads source code, converts it and executes it directly).",
            "answer": "False"
        },
        {
            "type": "true-or-false",
            "question": "Refactoring is a disciplined technique for restructuring an existing body of code, altering its internal structure without changing its external behavior.",
            "answer": "True"
        },
        {
            "type": "true-or-false",
            "question": "Software decay refers to the gradual deterioration of software over time or its decreasing inability to respond to its changing environment.",
            "answer": "False"
        },
        {
            "type": "true-or-false",
            "question": "There is only one type of testing.",
            "answer": "False"
        },
        {
            "type": "true-or-false",
            "question": "Debugging involves finding and removing bugs.",
            "answer": "True"
        },
        {
            "type": "true-or-false",
            "question": "Most IDEs don’t provide a programmer with a debugger tool in performing debugging.",
            "answer": "False"
        }
    ],
    "Web Systems Development": [
        {
            "type": "identification",
            "question": "Who founded the World Wide Web Consortium?",
            "answer": "Tim Berners-Lee"
        },

        {
            "type": "identification",
            "question": "It is a type of programming language used to combine existing components together.",
            "answer": "Scripting Language"
        },

        {
            "type": "identification",
            "question": "It is the most widely used client-side scripting language and is also used in server-side scripting.",
            "answer": "JavaScript"
        },
        {
            "type": "identification",
            "question": "Who conceptualized JavaScript in 1995?",
            "answer": "Brendan Eich"
        },
        {
            "type": "identification",
            "question": "This is a script that downloads asynchronously with HTML and other web resources.",
            "answer": "async"
        },

        {
            "type": "multiple-choice",
            "question": "1xx status codes are:",
            "options": [
                "Informational",
                "Successful",
                "Redirection",
                "Client-side Errors",
                "Server-side Errors"
            ],
            "answer": "Informational"
        },
        {
            "type": "multiple-choice",
            "question": "2xx status codes are:",
            "options": [
                "Informational",
                "Successful",
                "Redirection",
                "Client-side Errors",
                "Server-side Errors"
            ],
            "answer": "Successful"
        },
        {
            "type": "multiple-choice",
            "question": "3xx status codes are:",
            "options": [
                "Informational",
                "Successful",
                "Redirection",
                "Client-side Errors",
                "Server-side Errors"
            ],
            "answer": "Redirection"
        },
        {
            "type": "multiple-choice",
            "question": "4xx status codes are:",
            "options": [
                "Informational",
                "Successful",
                "Redirection",
                "Client-side Errors",
                "Server-side Errors"
            ],
            "answer": "Client-side Errors"
        },
        {
            "type": "multiple-choice",
            "question": "5xx status codes are:",
            "options": [
                "Successful",
                "Redirection",
                "Informational",
                "Client-side Errors",
                "Server-side Errors"
            ],
            "answer": "Server-side Errors"
        },


        {
            "type": "multiple-choice",
            "question": "What port does HTTP use?",
            "options": [
                "80",
                "443",
                "8080",
                "1010"
            ],
            "answer": "80"
        },

        {
            "type": "multiple-choice",
            "question": "What port does HTTPS use?",
            "options": [
                "80",
                "443",
                "8080",
                "1010"
            ],
            "answer": "443"
        },

        {
            "type": "multiple-choice",
            "question": "What is the URL of the first website?",
            "options": [
                "Myvirtuallearning.org",
                "Google.com",
                "Facebook.com",
                "Info.cern.ch"
            ],
            "answer": "Info.cern.ch"
        },

        {
            "type": "true-or-false",
            "question": "Tim Berners Lee founded the World Wide Web Consortium",
            "answer": "True"
        },

        {
            "type": "true-or-false",
            "question": "id, class, and title are global attributes.",
            "answer": "True"
        },
        {
            "type": "true-or-false",
            "question": "HTML was developed by Tim Berners-Lee at CERN.",
            "answer": "True"
        },

        {
            "type": "true-or-false",
            "question": "CSS is the language used to specify the presentation aspects of structurally marked-up documents.",
            "answer": "True"
        },

        {
            "type": "true-or-false",
            "question": "The CONNECT method establishes a tunnel to the server.",
            "answer": "True"
        },

        {
            "type": "true-or-false",
            "question": "The OPTIONS method describes the communication options for the target resource.",
            "answer": "True"
        },

        {
            "type": "true-or-false",
            "question": "A payload is a resource included in the HTTP response of the server.",
            "answer": "True"
        }

    ],
    "Software Engineering": [
        {
            "type": "identification",
            "question": "These are instructions (computer programs) that when executed provide desired function and performance",
            "answer": "Software"
        },
        {
            "type": "identification",
            "question": "This is a software system delivered to a customer",
            "answer": "Software product"
        },
        {
            "type": "identification",
            "question": "This is a type of software produced by a development organization and sold on the open market to any customer who is able to buy such product",
            "answer": ["Generic", "Generic Software"]
        },
        {
            "type": "identification",
            "question": "This is a type of software commissioned by a particular customer and developed by some contractor to suit the specific needs of the customer",
            "answer": ["Customized", "Customized Software", "Bespoke"]
        },
        {
            "type": "identification",
            "question": "An engineering discipline that is concerned with all aspects of software production such that high-quality software is produced in a cost-effective manner",
            "answer": "Software Engineering"
        },


        {
            "type": "true-or-false",
            "question": "Software failures receive a lot more publicity than software engineering success stories",
            "answer": "True"
        },
        {
            "type": "true-or-false",
            "question": "In the Waterfall Model, customers need interim releases",
            "answer": "False"
        },
        {
            "type": "true-or-false",
            "question": "There are two types of Evolutionary Development: Exploratory and Throw-away prototyping",
            "answer": "True"
        },
        {
            "type": "true-or-false",
            "question": "In Throw-away prototyping, development starts with parts of the system that are understood.",
            "answer": "False"
        },
        {
            "type": "true-or-false",
            "question": "In Formal Development, transformations are correctness-preserving so it is straightforward to show that the program conforms to its specification",
            "answer": "True"
        },
        {
            "type": "true-or-false",
            "question": "Formal development does not require specialised skills and training",
            "answer": "False"
        },
        {
            "type": "true-or-false",
            "question": "Reuse-oriented development are used by developers who know of designs or codes which are similar to that required",
            "answer": "True"
        },
        {
            "type": "true-or-false",
            "question": "Incremental model was initially suggested by Mills 1980",
            "answer": "True"
        },
        {
            "type": "true-or-false",
            "question": "Incremental model is most appropriate for systems with strict requirements in terms of reliability and risk management",
            "answer": "False"
        },
        {
            "type": "true-or-false",
            "question": "Package-Based Development Model is Based on the use of commercial-off-the-shelf packages (COTS)",
            "answer": "True"
        },


        {
            "type": "multiple-choice",
            "question": "A process model where phases are interleaved. In this model, the developer explores with the customer\'s requirements to deliver the system",
            "options": [
                "Waterfall",
                "Evolutionary",
                "Formal systems development",
                "Reuse-based development"
            ],
            "answer": "Evolutionary"
        },
        {
            "type": "multiple-choice",
            "question": "A process model where phases are distinct and separate. It is also a linear sequential model",
            "options": [
                "Waterfall",
                "Evolutionary",
                "Formal systems development",
                "Reuse-based development"
            ],
            "answer": "Waterfall"
        },
        {
            "type": "multiple-choice",
            "question": "A process model where the system is assembled from existing components",
            "options": [
                "Waterfall",
                "Evolutionary",
                "Formal systems development",
                "Reuse-based development"
            ],
            "answer": "Reuse-based development"
        },
        {
            "type": "multiple-choice",
            "question": "A development model based on the transformation of mathematical specification through different representations to an executable program",
            "options": [
                "Waterfall",
                "Evolutionary",
                "Formal systems development",
                "Reuse-based development"
            ],
            "answer": "Formal systems development"
        },
        {
            "type": "multiple-choice",
            "question": "Describes a set of clear stages in the development process, and a specific set of deliverables (documents, code, etc) which must be produced during each stage",
            "options": [
                "Waterfall",
                "Evolutionary",
                "Formal systems development",
                "Reuse-based development"
            ],
            "answer": "Waterfall"
        },
        {
            "type": "multiple-choice",
            "question": "An architectural style that is a variation of the repository model; A shared repository of problems, partial solutions, suggestions and contributed information.",
            "options": [
                "Pipeline",
                "Layered",
                "Repository",
                "Blackboard"
            ],
            "answer": "Blackboard"
        },
        {
            "type": "multiple-choice",
            "question": "An architectural style that consists of a central data store and a set of independent components that access the data store",
            "options": [
                "Pipeline",
                "Layered",
                "Repository",
                "Blackboard"
            ],
            "answer": "Repository"
        },
        {
            "type": "multiple-choice",
            "question": "An architectural style that is accomplished by applying a local transformation to the input streams and computing incrementally so output begins before input is consumed",
            "options": [
                "Pipeline",
                "Layered",
                "Repository",
                "Blackboard"
            ],
            "answer": "Pipeline"
        },
        {
            "type": "multiple-choice",
            "question": "An architectural pattern that organizes a system into layers, each of which provide a set of services",
            "options": [
                "Pipeline",
                "Layered",
                "Repository",
                "Blackboard"
            ],
            "answer": "Layered"
        },
        {
            "type": "multiple-choice",
            "question": "An architectural pattern that is widely used for machine control applications and are typically modeled via finite state machines",
            "options": [
                "Implicit Invocation",
                "Process-control",
                "Client-server",
                "Two-tier"
            ],
            "answer": "Process-control"
        }
    ],
    "Technology-Assisted Presentation and Communcation": [
        {
            "type": "identification",
            "question": "The process of generating meaning by sending and receiving verbal and non-verbal symbols and signs that are influenced by multiple contexts.",
            "answer": "Communication"
        },
        {
            "type": "identification",
            "question": "A structured communication based on the actual audience\’s needs in order to achieve a certain purpose.",
            "answer": "Presentation"
        },
        {
            "type": "identification",
            "question": "A dense content in a presentation intended as a discussion document or whitepaper",
            "answer": "Presentation"
        },
        {
            "type": "identification",
            "question": "A tool in presentation where texts on the slide functions as a crutch for the presenter. The audience either reads the slides or listens to the presenter",
            "answer": "Teleprompter"
        },

        {
            "type": "identification",
            "question": "This visual element defines the structure formed when relationships are applied to a set of elements. ",
            "answer": "Hierarchy"
        },


        {
            "type": "true-or-false",
            "question": "There are three types of presentation",
            "answer": "false"
        },

        {
            "type": "true-or-false",
            "question": "Presentation is a tool for high-stakes internal and external communications.",
            "answer": "True"
        },
        {
            "type": "true-or-false",
            "question": "Flow pertains to the ordoring of how information is processed",
            "answer": "True"
        },
        {
            "type": "true-or-false",
            "question": "Grid is sensing the Structure of Information presented in a slide",
            "answer": "False"
        },
        {
            "type": "true-or-false",
            "question": "All stylistic choices have the potential to suggest importance, urgency, and value",
            "answer": "True"
        },


        {
            "type": "multiple-choice",
            "question": "A type of presentation that conveys the understanding of an idea",
            "options": [
                "Declarative",
                "Persuasive",
                "Informative",
                "Communicative"
            ],
            "answer": "Informative"
        },
        {
            "type": "multiple-choice",
            "question": "A type of presentation that influence a change in the belief, attitude, or behavior",
            "options": [
                "Declarative",
                "Persuasive",
                "Informative",
                "Communicative"
            ],
            "answer": "Persuasive"
        },
        {
            "type": "multiple-choice",
            "question": "A principle of effective communication that involves communicating your message accurately",
            "options": [
                "Completeness",
                "Conciseness",
                "Consideration",
                "Clarity"
            ],
            "answer": "Clarity"
        },
        {
            "type": "multiple-choice",
            "question": "A principle of effective communication that Consider the audience\’s viewpoints, background, mindset, and educational level",
            "options": [
                "Completeness",
                "Conciseness",
                "Consideration",
                "Clarity"
            ],
            "answer": "Consideration"
        },
        {
            "type": "multiple-choice",
            "question": "A principle of effective communication that involves providing all the necessary facts to the audience",
            "options": [
                "Completeness",
                "Conciseness",
                "Consideration",
                "Clarity"
            ],
            "answer": "Completeness"
        },
        {
            "type": "multiple-choice",
            "question": "A principle of effective communication that involves communicating what you want to convey in limited words",
            "options": [
                "Completeness",
                "Conciseness",
                "Consideration",
                "Clarity"
            ],
            "answer": "Conciseness"
        },
        {
            "type": "multiple-choice",
            "question": "A principle of effective communication that pertains to being tactful, thoughtful, and appreciative",
            "options": [
                "Concreteness",
                "Courtesy",
                "Correctness",
                "Completeness"
            ],
            "answer": "Courtesy"
        },
        {
            "type": "multiple-choice",
            "question": "A principle of effective communication that pertains to using direct (dictionary) words rather than ideas suggested by a word",
            "options": [
                "Concreteness",
                "Courtesy",
                "Correctness",
                "Completeness"
            ],
            "answer": "Concreteness"
        },
        {
            "type": "multiple-choice",
            "question": "A principle of effective communication that pertains to avoiding grammatical errors and misspelled words",
            "options": [
                "Concreteness",
                "Courtesy",
                "Correctness",
                "Completeness"
            ],
            "answer": "Correctness"
        },
        {
            "type": "multiple-choice",
            "question": "A level of language that is non-conversational, impersonal, usually composed of long sentences and is used in dissertations and legal documents",
            "options": [
                "Informal",
                "Substandard",
                "Formal",
                "Vernacular"
            ],
            "answer": "Formal"
        },
    ]
};