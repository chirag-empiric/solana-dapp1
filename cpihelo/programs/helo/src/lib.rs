use anchor_lang::prelude::*;

declare_id!("8uetvwenXxTQ4obAkcYCEEuwWRYzDefrUDo8sP2bkYUg");

#[program]
pub mod helo {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn store_name(ctx: Context<StoreName>) -> Result<()> {
        let context = &mut ctx.accounts.data;
        context.msg = String::from("Hello from hello");
        Ok(())
    }

    pub fn update_name(ctx: Context<StoreName>, new_name: String) -> Result<()> {
        let context = &mut ctx.accounts.data;
        context.msg = new_name;
        Ok(())
    }
}

#[account]
pub struct Data {
    msg: String,
}

#[derive(Accounts)]
pub struct StoreName<'info> {
    #[account(mut)]
    data: Account<'info, Data>,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, seeds = [b"helo"], bump, space = 32)]
    data: Account<'info, Data>,
    #[account(mut)]
    signer: Signer<'info>,
    system_program: Program<'info, System>,
}
