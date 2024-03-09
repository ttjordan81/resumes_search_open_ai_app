global.log = { 
    info: jest.fn((msg) => { 
        //console.log("log.info() message:", msg)
    }),
    error: jest.fn((msg) => { 
        // console.log("log.error() message:", msg)
    })
};
