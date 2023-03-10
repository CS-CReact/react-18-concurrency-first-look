import { Suspense, useState, useTransition } from 'react';
import Loading from './Loading'
import ProductList from './ProductList';

export default function SuspenseContainer() {
    return (
        <>
            <h3>Suspense Demo</h3> 
            <Suspense fallback = {<Loading/>}>
                <ProductList/>
            </Suspense>
        </>

    )
}