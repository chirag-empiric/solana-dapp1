use anchor_lang::prelude::*;

declare_id!("CRjWCs644dmTa2BQjWW5AjvCkRpwmPtmF55CR6t4GmBG");

#[program]
pub mod rustshi {
    use anchor_lang::solana_program::{program::invoke, system_instruction::transfer};

    use super::*;

    pub fn participate(mut ctx: Context<MainDataSource>, amount: u64) -> Result<()> {
        let cont = &mut ctx.accounts;

        invoke(
            &transfer(&cont.signer.key(), &cont.hits.key(), amount),
            &[cont.signer.to_account_info(), cont.hits.to_account_info()],
        )?;

        let mut user_exist = false;

        for (pos, ele) in cont.hits.user_list.clone().iter().enumerate() {
            if *ele == cont.signer.key() {
                cont.hits.user_deposits[pos] += amount;
                user_exist = true;
                break;
            }
        }

        if user_exist == false {
            cont.hits.user_list.push(cont.signer.key());
            cont.hits.user_deposits.push(amount);
        }

        Ok(())
    }
}

#[account]
pub struct Hits {
    user_list: Vec<Pubkey>,
    user_deposits: Vec<u64>,
    hits: u16,
}

#[derive(Accounts)]
pub struct MainDataSource<'info> {
    #[account(init_if_needed, payer = signer, space= 32 * 8 + 2 + 8, seeds = [b"helo"], bump)]
    hits: Account<'info, Hits>,
    #[account(mut)]
    signer: Signer<'info>,
    system_program: Program<'info, System>,
}
