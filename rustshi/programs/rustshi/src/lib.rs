use anchor_lang::prelude::*;

declare_id!("AGHt9cGqRDo1dokwpXMTbRwrJzgqTmuCfLJKBG28cDv6");

#[program]
pub mod simplepred {
    use anchor_lang::solana_program::{program::invoke, system_instruction::transfer};

    use super::*;

    pub fn part_bet(mut ctx: Context<GlobalContext>, amt: u64, choice: Choice) -> Result<()> {
        let context = &mut ctx.accounts;

        let user_bet = Bet {
            bet_amount: amt,
            user_choice: choice, // passing true false from the arg itself
            p_key: context.signer.key(),
        };
        context.global_state.userlist.push(user_bet);
        context.global_state.total_betting_amount += amt;

        // token transfer shit here - learn CPI for that (transferFrom type shi prolly)
        let reward_pool = 90 * amt / 100;
        // let platform = 7 * amt / 100;
        // let burn_pool = 3 * amt / 100;

        // 90% rewards pool
        invoke(
            &transfer(
                &context.signer.key(),
                &context.reward_pool.key(),
                reward_pool,
            ),
            &[
                context.signer.to_account_info(),
                context.reward_pool.to_account_info(),
            ],
        )?;

        // 7%  platform
        // 3%  burnt
        Ok(())
    }

    pub fn declare_result(ctx: Context<FinalContext>, winning_choice: Choice) -> Result<()> {
        let final_state = &mut ctx.accounts.final_state;
        let global_state = &ctx.accounts.global_state;

        final_state.correct_choice = winning_choice;

        // pick list of winners somehow
        let mut winners: Vec<Pubkey> = Vec::new();
        for bet in &global_state.userlist {
            if bet.user_choice.clone() == winning_choice.clone() {
                winners.push(bet.p_key);
            }
        }

        final_state.winning_user_address = winners;

        Ok(())
    }
}

#[derive(Clone, Copy, AnchorDeserialize, AnchorSerialize, PartialEq, Eq)]
pub enum Choice {
    Trump(bool),
    Kamala(bool),
    Obama(bool),
    Modiji(bool),
}

#[derive(Clone, AnchorDeserialize, AnchorSerialize)]
pub struct Bet {
    p_key: Pubkey,
    bet_amount: u64,
    user_choice: Choice,
}

#[account]
pub struct GlobalState {
    userlist: Vec<Bet>,
    total_betting_amount: u64,
}

#[account]
pub struct FinalState {
    correct_choice: Choice,
    winning_user_address: Vec<Pubkey>,
}

#[derive(Accounts)]
pub struct GlobalContext<'info> {
    #[account(init_if_needed, payer = signer, space = (32 + 8 + 1) * 100 + 8, seeds = [b"jua"], bump)]
    global_state: Account<'info, GlobalState>,
    #[account(mut)]
    signer: Signer<'info>,
    #[account(mut, seeds = [b"khatu"], bump)]
    reward_pool: AccountInfo<'info>,
    system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct FinalContext<'info> {
    #[account(init_if_needed, payer = signer, space = (32 + 8 + 1) * 100 + 8, seeds = [b"juari"], bump)]
    final_state: Account<'info, FinalState>,
    #[account(mut, seeds = [b"jua"], bump)]
    global_state: Account<'info, GlobalState>,
    #[account(mut)]
    signer: Signer<'info>,
    system_program: Program<'info, System>,
}
