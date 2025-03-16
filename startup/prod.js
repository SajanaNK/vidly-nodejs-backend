import helmet from "helmet";
import express from "express";
import compression from "compression";


export function prod(app) {
    app.use(helmet());
    app.use(compression());
}