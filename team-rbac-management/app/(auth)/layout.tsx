const AuthLayout =({children}:{children :React.ReactNode})=>{
    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950">
            {children}
        </div>
    )
}
export default AuthLayout;
