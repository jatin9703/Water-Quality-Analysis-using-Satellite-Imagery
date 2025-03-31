const config={
    username:process.env.NEXT_PUBLIC_USERNAME,
    password:process.env.NEXT_PUBLIC_PASSWORD,
    mapbox_api:process.env.NEXT_PUBLIC_MAPBOX_API,
    rapid_api_01:process.env.NEXT_PUBLIC_RAPID_API_01,
    rapid_api_02:process.env.NEXT_PUBLIC_RAPID_API_02,
    backend_api:"http://192.168.176.176:5000/api/receive",
};

export default config;